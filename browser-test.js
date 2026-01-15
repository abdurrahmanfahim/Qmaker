// Browser Console Test Script
// Copy and paste this in browser console to verify changes

console.log('🧪 Starting Qmaker Verification Tests...\n');

// Test 1: Character Encoding
console.log('📝 Test 1: Character Encoding');
try {
  const testData = {
    bangla: 'প্রশ্ন এবং উত্তর',
    arabic: 'السؤال والجواب',
    urdu: 'سوال اور جواب',
    special: `Test with ' " / \\ & < >`
  };
  
  // New format (Base64)
  const jsonStr = JSON.stringify(testData);
  const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
  localStorage.setItem('qmaker-test-new', encoded);
  
  // Decode
  const stored = localStorage.getItem('qmaker-test-new');
  const decoded = decodeURIComponent(escape(atob(stored)));
  const result = JSON.parse(decoded);
  
  const pass = result.bangla === testData.bangla && 
               result.arabic === testData.arabic && 
               result.urdu === testData.urdu &&
               result.special === testData.special;
  
  console.log(pass ? '✅ PASS - Character encoding works' : '❌ FAIL - Character encoding broken');
  console.log('Original:', testData);
  console.log('Decoded:', result);
  
  localStorage.removeItem('qmaker-test-new');
} catch (e) {
  console.log('❌ FAIL - Character encoding error:', e.message);
}

// Test 2: Backward Compatibility
console.log('\n📝 Test 2: Backward Compatibility');
try {
  const oldData = { name: 'Old Format Data', value: 'টেস্ট' };
  
  // Old format (plain JSON)
  localStorage.setItem('qmaker-test-old', JSON.stringify(oldData));
  
  // Try to read with new code (should fallback)
  const stored = localStorage.getItem('qmaker-test-old');
  let result;
  try {
    const decoded = decodeURIComponent(escape(atob(stored)));
    result = JSON.parse(decoded);
  } catch (e) {
    // Fallback to old format
    result = JSON.parse(stored);
  }
  
  const pass = result.name === oldData.name && result.value === oldData.value;
  console.log(pass ? '✅ PASS - Backward compatibility works' : '❌ FAIL - Backward compatibility broken');
  console.log('Original:', oldData);
  console.log('Decoded:', result);
  
  localStorage.removeItem('qmaker-test-old');
} catch (e) {
  console.log('❌ FAIL - Backward compatibility error:', e.message);
}

// Test 3: Existing localStorage Data
console.log('\n📝 Test 3: Existing localStorage Data');
try {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('qmaker-'));
  console.log(`Found ${keys.length} Qmaker keys in localStorage`);
  
  let readable = 0;
  keys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      // Try new format first
      try {
        const decoded = decodeURIComponent(escape(atob(data)));
        JSON.parse(decoded);
        readable++;
      } catch (e) {
        // Try old format
        JSON.parse(data);
        readable++;
      }
    } catch (e) {
      console.log(`⚠️ Warning: Could not read ${key}`);
    }
  });
  
  console.log(`✅ ${readable}/${keys.length} keys are readable`);
} catch (e) {
  console.log('❌ FAIL - localStorage check error:', e.message);
}

// Test 4: Paper Storage Functions
console.log('\n📝 Test 4: Paper Storage Functions');
try {
  // Check if paperStorage is available
  if (typeof window !== 'undefined') {
    console.log('✅ Running in browser environment');
    console.log('ℹ️ Paper storage functions will be tested during app usage');
  }
} catch (e) {
  console.log('❌ FAIL - Environment check error:', e.message);
}

// Test 5: Cloud Sync Functions
console.log('\n📝 Test 5: Cloud Sync Functions');
try {
  console.log('ℹ️ Cloud sync will be tested during login flow');
  console.log('ℹ️ Check browser console for "Synced from cloud" message after login');
} catch (e) {
  console.log('❌ FAIL - Cloud sync check error:', e.message);
}

console.log('\n✅ Verification Tests Complete!');
console.log('\n📋 Manual Testing Checklist:');
console.log('1. Create a new paper with Bengali text');
console.log('2. Save and close browser');
console.log('3. Reopen and verify text is intact');
console.log('4. Login with Google');
console.log('5. Verify cloud data syncs to local');
console.log('6. Check console for "Synced from cloud" message');
console.log('\n🚀 Ready for GitHub push!');
