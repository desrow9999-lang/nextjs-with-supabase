import { createClient } from '@/utils/supabase/server';

export default async function TodosPage() {
  const supabase = await createClient();
  const { data: todos } = await supabase.from('todos').select('*');

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">記録一覧</h1>
      <ul className="list-disc pl-5">
        {todos?.map((todo: any) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </main>
  );
}
