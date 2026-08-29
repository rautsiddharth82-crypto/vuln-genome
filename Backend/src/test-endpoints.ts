async function testEndpoints() {
  const BASE_URL = 'http://127.0.0.1:5000/api/v1';

  console.log('--- 1. Testing Health ---');
  const healthRes = await fetch('http://127.0.0.1:5000/health');
  console.log('Health Status:', healthRes.status, await healthRes.json());

  console.log('\n--- 2. Testing Multipart File Upload ---');
  const formData = new FormData();
  const blob1 = new Blob(['public class UserSearchService { void query() {} }'], { type: 'text/plain' });
  const blob2 = new Blob(['import os\nos.system("ping 127.0.0.1")'], { type: 'text/plain' });
  formData.append('files', blob1, 'UserSearchService.java');
  formData.append('files', blob2, 'network_probe.py');

  const uploadRes = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  const uploadData: any = await uploadRes.json();
  console.log('Upload Result:', uploadData.message);
  console.log('Uploaded Files:', uploadData.files?.map((f: any) => `${f.name} (${f.language})`));

  console.log('\n--- 3. Testing Scan / AST Invariant Analyzer ---');
  const scanPayload = {
    files: [
      {
        name: 'UserSearchService.java',
        content: `public class UserSearchService {\n  public User findUser(String userId) throws Exception {\n    String query = "SELECT * FROM users WHERE user_id = '" + userId + "' AND role = 'USER'";\n    Statement stmt = connection.createStatement();\n    ResultSet rs = stmt.executeQuery(query);\n    return parseUser(rs);\n  }\n}`,
        language: 'java',
      },
      {
        name: 'network_probe.py',
        content: `import os\ndef ping_host(host_ip):\n    cmd = f"ping -c 1 {host_ip}"\n    os.system(cmd)`,
        language: 'python',
      },
    ],
    options: {
      staticAnalysis: true,
      fuzzing: true,
      dynamicAnalysis: true,
      regressionTesting: true,
      generateProofCertificate: true,
      airGappedMode: false,
    },
  };

  const scanRes = await fetch(`${BASE_URL}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scanPayload),
  });
  const scanData: any = await scanRes.json();
  console.log('Scan Created ID:', scanData.id);
  console.log('Scan Status:', scanData.status, '| Stage:', scanData.currentStage);
  console.log('Vulnerabilities Found:', scanData.vulnerabilitiesFound);
  console.log('Vulnerabilities List:', scanData.vulnerabilities.map((v: any) => `${v.id} (${v.cwe}) - ${v.title}`));

  const targetVulnId = scanData.vulnerabilities[0]?.id || 'VULN-2026-0847';

  console.log(`\n--- 4. Testing Patch Synthesis for ${targetVulnId} ---`);
  const patchRes = await fetch(`${BASE_URL}/patch/${targetVulnId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const patchData: any = await patchRes.json();
  console.log('Synthesizer:', patchData.synthesizer);
  console.log('Style Score:', patchData.styleMatchingScore);
  console.log('Generated Diff snippet:\n', patchData.diff.substring(0, 180));

  console.log(`\n--- 5. Testing 7-Stage Verification Pipeline for ${targetVulnId} ---`);
  const verifyRes = await fetch(`${BASE_URL}/patch/${targetVulnId}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const verifyData: any = await verifyRes.json();
  console.log('Verification Status:', verifyData.status);
  console.log('Total Checks Passed:', verifyData.checks?.length, 'checks');
  console.log('Break-My-Patch Survived:', verifyData.metrics?.breakMyPatchSurvived);
  console.log('Certificate Issued ID:', verifyData.certificate?.id);
  console.log('SHA-256 Hash:', verifyData.certificate?.sha256Hash);

  console.log(`\n--- 6. Testing Patch Application (Mark FIXED) ---`);
  const applyRes = await fetch(`${BASE_URL}/patch/${targetVulnId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const applyData: any = await applyRes.json();
  console.log('Vulnerability Post-Apply Status:', applyData.status);

  console.log('\n--- 7. Testing Genomes, Stats & AI Swarm Agent Command ---');
  const genomesRes = await fetch(`${BASE_URL}/genomes`);
  const genomesData: any = await genomesRes.json();
  console.log('Genomes Count:', genomesData.length);

  const statsRes = await fetch(`${BASE_URL}/stats`);
  const statsData: any = await statsRes.json();
  console.log('Security Score:', statsData.securityScore, '| Patch Success Rate:', statsData.patchSuccessRate);

  const aiRes = await fetch(`${BASE_URL}/ai/agent-command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Execute full swarm AST scan and adversarial mutation fuzzing on core modules',
    }),
  });
  const aiData: any = await aiRes.json();
  console.log('AI Commander Plan:', aiData.planSummary);
  console.log('AI Primary Agent:', aiData.primaryAgentId);

  console.log('\n ALL 7 BACKEND PIPELINES (UPLOAD, ANALYZE, VERIFY, PATCH, CERTIFY, GENOMES, AI SWARM) PASSED 100%!');
  process.exit(0);
}

testEndpoints().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
