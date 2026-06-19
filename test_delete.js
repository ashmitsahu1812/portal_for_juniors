async function testDelete() {
  try {
    const baseURL = 'https://portal-for-juniors.onrender.com/api';
    
    console.log('Registering test user...');
    const regRes = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Delete',
        email: 'test_delete_' + Date.now() + '@example.com',
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    if (!regData.success) throw new Error(regData.message);
    
    const token = regData.data.token;
    console.log('Got token:', token);
    
    console.log('Attempting delete...');
    const delRes = await fetch(`${baseURL}/auth/me`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const delData = await delRes.json();
    console.log('Delete Response:', delData);
  } catch (err) {
    console.error('Error:', err.message);
  }
}
testDelete();
