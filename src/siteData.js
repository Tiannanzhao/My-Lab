import epicTeamImg from './assets/epic-team.png'
import flowerIcon from './assets/flower-icon.png'

const ASSET_BASE = 'https://intercom.design/assets'

export function intercomAsset(path) {
  return `${ASSET_BASE}/${path}`
}

export const archiveData = [
  { title: 'AI crypto benchmark', product: 'Vibe4trading', category: 'Side Project', date: 'Mar 2026' },
  { title: 'AI Coding Shortcuts', product: 'ArrowPrompt', category: 'Side Project', date: 'Jan 2026' },
  { title: '0→1 product & roadmap', product: 'Bagelpay', category: 'Freelance', date: 'Aug 2025' },
  { title: 'Cross channel campaign builder', product: 'Ometria', category: 'Product', date: 'Jan 2025' },
  { title: 'AI dating therapy', product: 'Mingle AI', category: 'Side Project', date: 'Oct 2024' },
  { title: 'Subscriber reports', product: 'Ometria', category: 'Product', date: 'Sep 2024' },
  { title: 'Conversational AI insight agents', product: 'Ometria', category: 'Product', date: 'Jul 2024' },
  { title: 'AI visual & motion system', product: 'Ometria', category: 'Design Systems', date: '2024' },
  { title: '0→1 product', product: 'Net-ify', category: 'Side Project', date: 'Apr 2024' },
  { title: 'Omnichannel delivery experience', product: 'Burberry', category: 'UX Strategy', date: 'Oct 2022' },
  { title: 'Cross-platform design system', product: 'Burberry', category: 'Design Systems', date: '2023' },
  { title: 'Professional networking + CRM', product: 'Net-ify', category: 'Side Project', date: 'Apr 2023' },
  { title: 'Order-to-operations management system', product: 'Collectiv Food', category: '0→1 Product', date: 'Mar 2021' },
  { title: 'Scooter platform UX & web', product: 'Segway-Ninebot', category: 'Freelance', date: '2019' },
  { title: 'Copyright revenue calculator', product: 'Believe Music', category: 'Freelance', date: '2020' },
  { title: 'Digital campaign + motion assets', product: 'Hylink', category: 'Brand', date: 'Mar 2020' },
]

export const articlesData = {
  posts: {
    title: 'POSTS',
    articles: [
      {
        title: 'Good Bot / Bad Bot',
        author: 'Des Traynor',
        url: 'https://fin.ai/ideas/good-bot-bad-bot/',
      },
      {
        title: 'Sparkling Specificity',
        author: 'Des Traynor',
        url: 'https://fin.ai/ideas/%e2%9c%a8sparkling-specificity%e2%9c%a8/',
      },
      {
        title: 'Why an AI-driven Customer Experience Score will replace human-surveyed CSAT',
        author: 'Brian Donohue',
        url: 'https://fin.ai/ideas/why-an-ai-driven-customer-experience-score-will-replace-human-surveyed-csat/',
      },
      {
        title: 'The timeline to fully automated Customer Service',
        author: 'Paul Adams',
        url: 'https://fin.ai/ideas/the-timeline-to-fully-automated-customer-service/',
      },
      {
        title: 'An AI conundrum: Products or Partnerships',
        author: 'Paul Adams',
        url: 'https://fin.ai/ideas/an-ai-conundrum-products-or-partnerships/',
      },
      {
        title: 'Inconvenient truths about how we measure Customer Service, and how AI will save us',
        author: 'Paul Adams',
        url: 'https://fin.ai/ideas/inconvenient-truths-about-how-we-measure-customer-service-and-how-ai-will-save-us/',
      },
      {
        title: 'Watch: Demos and Prototypes',
        author: 'Paul Adams',
        url: 'https://fin.ai/ideas/demos-and-prototypes/',
      },
      {
        title: 'Intercom on Product: How we became an AI-first company',
        author: "Davin O'Dwyer",
        url: 'https://www.intercom.com/blog/videos/intercom-on-product-how-we-became-an-ai-first-company/',
      },
      {
        title: 'Intercom on Product: DeepSeek, agents, and the future of AI with Benedict Evans',
        author: 'Liam Geraghty',
        url: 'https://www.intercom.com/blog/videos/intercom-on-product-benedict-evans-ai/',
      },
    ],
  },
  talks: {
    title: 'TALKS & EVENTS',
    articles: [
      {
        title: "Why Old UI Designs Won't Work with AI | Off Script",
        author: 'Emmet Connolly',
        url: 'https://www.youtube.com/watch?v=I8hMPj3AD34',
      },
      {
        title: 'Working at Intercom with Tatiana Sivo | Product Designer',
        author: 'Tatiana Sivo',
        url: 'https://www.youtube.com/watch?v=L4qvhTuoO4A&list=PLlCIldMZCaFq2FOT-aQC8H7YL4xHSaQbB&index=8',
      },
      {
        title: 'Working at Intercom with Murtaza Abidi | Senior Product Designer',
        author: 'Murtaza Abidi',
        url: 'https://www.youtube.com/watch?v=3rdWaH-M8f8&list=PLlCIldMZCaFq2FOT-aQC8H7YL4xHSaQbB&index=9',
      },
    ],
  },
}

export const cards = [
  {
    id: 'brand-reel',
    type: 'image',
    top: '25%',
    left: '19%',
    src: epicTeamImg,
    label: 'EPICConnector Team',
    originalSize: true,
  },
  {
    id: 'vibe-ascii',
    type: 'ascii',
    top: '24%',
    left: '50%',
    centered: true,
    label: 'Vibe4Trading ASCII Hero',
  },
  {
    id: 'img-5',
    type: 'image',
    top: '78%',
    left: '55%',
    src: intercomAsset('images/img5.png'),
    label: '',
  },
  {
    id: 'yt-transition',
    type: 'youtube',
    top: '55%',
    left: '58%',
    embedId: 'rRljig2AS0g',
    label: 'Transitioning into the next era of design',
  },
  {
    id: 'spotify-my-podcast',
    type: 'spotify',
    top: '44%',
    left: '74%',
    embedId: 'episode/3Cx51u7IWPEjufztYSrPWq',
    label: 'My Podcast Episode',
  },
  {
    id: 'logo',
    type: 'logo',
    top: '45%',
    left: '50%',
    centered: true,
    text: 'Welcome to my lab',
    lines: ['Welcome to my lab'],
  },

  {
    id: 'folder-posts',
    type: 'folder',
    top: '40%',
    left: '32%',
    title: 'POSTS',
    label: 'POSTS',
    folderId: 'posts',
  },
  {
    id: 'folder-archive',
    type: 'folder',
    top: '47%',
    left: '62%',
    title: 'Archive of work',
    label: 'Archive of work',
    folderId: 'resume',
  },
  {
    id: 'quote-design',
    type: 'blockquote',
    top: '54%',
    left: '30%',
    icon: flowerIcon,
    text: "Tools for designers, I build design skills that help AI understand taste, not just UI appearance.",
    highlight: "Tools for designers, I build design skills",
    highlightColor: 'accent-gold',
    link: 'https://github.com/Tiannanzhao/design-feel-like-your-own-product',
  },

  {
    id: 'rotary-radio',
    type: 'radio',
    top: '72%',
    left: '36%',
    label: 'Digital Rotary Radio',
  },
]
