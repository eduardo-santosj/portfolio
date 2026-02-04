export default function sitemap() {
  return [
    {
      url: 'https://edusantos.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
  ];
}
