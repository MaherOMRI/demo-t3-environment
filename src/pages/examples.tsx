/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React from 'react';
import { vanillaApi } from '~/utils/api';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from 'react-query';
interface Example {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
const Examples: React.FC<{}> = () => {
  const queryClient = new QueryClient(); // Create an instance of QueryClient

  const { data, isLoading } = useQuery<Example[], unknown>('getAll', () =>
    vanillaApi.example.getAll()
  );

  const deleteExample = useMutation((id) =>
    vanillaApi.example.deleteSingle(id)
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteExample.mutateAsync(id);
      queryClient.invalidateQueries('getAll');
    } catch (error) {
      console.log(error)
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <QueryClientProvider client={queryClient}> {/* Provide the queryClient instance */}
      <div>
        <h1>Examples</h1>
        <ul>
          {data?.map((item) => (
            <li key={item.id}>
              {item.id} - {item.createdAt.toISOString()} - {item.updatedAt.toISOString()}{' '}
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </QueryClientProvider>
  );
};

export default Examples;
