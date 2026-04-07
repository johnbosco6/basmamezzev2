
import { readFile } from 'fs/promises';
import { createClient } from '@sanity/client';

async function run() {
  const env = await readFile('.env.local', 'utf8');
  const getToken = (name) => {
    const line = env.split('\n').find(l => l.includes(name));
    return line ? line.split('=')[1]?.trim() : null;
  };
  
  const client = createClient({
    projectId: getToken('NEXT_PUBLIC_SANITY_PROJECT_ID') || 'dtk1tgvl',
    dataset: getToken('NEXT_PUBLIC_SANITY_DATASET') || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: getToken('SANITY_API_TOKEN'),
  });

  try {
    const docs = await client.fetch('*[_type == "menuItem"]');
    console.log(`Found ${docs.length} menu items`);
    docs.forEach(d => console.log(`- ${d.name} (_id: ${d._id})`));
    
    if (docs.length === 0) {
        const any = await client.fetch('*[0...5]');
        console.log('Sample docs:', any.map(a => a._type));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
