/**
 * ALIVE Slice 1 Test: "hello?" signal through 8 stages
 * 
 * Flow:
 * 1. Interface: Create signal "hello?"
 * 2. Body: Ingest and firewall
 * 3. Runtime: Route to STG
 * 4. STG: Evaluate and gate (stage 1)
 * 5. Runtime: Route to Mind
 * 6. Mind: Reason and decide (stage 2-5)
 * 7. Runtime: Enforce decision (stage 6)
 * 8. Body: Execute action (stage 7)
 * 9. Interface: Display result (stage 8)
 */

import { ingestInput } from '../../alive-body/src/sensors/ingestion';
import { routeSignal } from '../../alive-runtime/src/router/signal-router';
import { getLog } from '../../alive-body/src/logging/execution-log';
import { startup } from '../../alive-runtime/src/lifecycle/startup';

async function main() {
  console.log('\n=== ALIVE Slice 1 Test: "hello?" Signal ===\n');
  
  // Startup runtime enforcement
  console.log('[STARTUP] Initializing ALIVE runtime...\n');
  await startup();
  console.log('[STARTUP] Runtime initialized. STG online. Mind bridge ready.\n');
  
  console.log('[STAGE 0] Interface: Creating signal...\n');
  
  // Stage 0: Interface creates signal
  const testInput = 'hello?';
  console.log(`  Input: "${testInput}"`);
  
  // Stage 1-2: Body ingestion and firewall
  console.log('\n[STAGE 1] Body: Ingesting and firewall check...\n');
  const signal = ingestInput(testInput);
  console.log(`  Signal ID: ${signal.id}`);
  console.log(`  Source: ${signal.source}`);
  console.log(`  Raw content: "${signal.raw_content}"`);
  console.log(`  Firewall status: ${signal.firewall_status}`);
  console.log(`  Threat flag: ${signal.threat_flag}`);
  
  // Stage 3-8: Runtime routing (STG, Mind, Enforcement, Body execution)
  console.log('\n[STAGE 2-8] Runtime: Routing through STG → Mind → Enforcement → Body execution...\n');
  const result = routeSignal(signal);
  
  // Display result
  console.log('\n[STAGE 9] Interface: Displaying result...\n');
  console.log(`ALIVE result: ${result}\n`);
  
  // Execution log trace
  console.log('[Execution Log Trace]\n');
  const log = getLog();
  if (log && log.length > 0) {
    log.forEach((entry: any, index: number) => {
      console.log(`${index + 1}. ${JSON.stringify(entry)}`);
    });
  } else {
    console.log('(No execution log entries)');
  }
  
  console.log('\n=== Test Complete ===\n');
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
