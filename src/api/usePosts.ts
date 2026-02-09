import { useQuery } from '@tanstack/react-query'

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  return response.json()
}

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })
}
