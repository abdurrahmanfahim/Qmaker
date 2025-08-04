// SEO optimization utilities
export const updateMetaTags = (title, description, keywords = []) => {
  // Update page title
  document.title = title ? `${title} - Qmaker` : 'Qmaker - Question Paper Builder';
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description || 'Professional multilingual question paper builder for educators. Create question papers in Arabic, Bangla, Urdu, and English.');
  }
  
  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    const defaultKeywords = ['question paper', 'exam builder', 'education', 'multilingual', 'teacher tools'];
    metaKeywords.setAttribute('content', [...defaultKeywords, ...keywords].join(', '));
  }
  
  // Update Open Graph tags
  updateOpenGraphTags(title, description);
};

const updateOpenGraphTags = (title, description) => {
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  
  if (ogTitle) {
    ogTitle.setAttribute('content', title || 'Qmaker - Question Paper Builder');
  }
  
  if (ogDescription) {
    ogDescription.setAttribute('content', description || 'Professional multilingual question paper builder for educators');
  }
};

export const generateStructuredData = (paperData) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": paperData.metadata?.examName || "Question Paper",
    "description": "Educational question paper created with Qmaker",
    "creator": {
      "@type": "Person",
      "name": paperData.metadata?.teacherName || "Educator"
    },
    "educationalLevel": paperData.metadata?.className || "Academic",
    "about": paperData.metadata?.subject || "Education",
    "inLanguage": paperData.metadata?.language || "en",
    "dateCreated": new Date().toISOString()
  };
  
  // Update or create structured data script
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(structuredData);
};