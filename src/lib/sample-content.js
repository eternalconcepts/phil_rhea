import caseStudyImage from "../images/civ_01.jpg"
import portfolioCoverImage from "../images/philip-rhea-architecture.jpg"
import portfolioGalleryOne from "../images/res_07.jpg"
import portfolioGalleryTwo from "../images/sta_02.jpg"

function toImageAsset(image, alt) {
  return {
    url: image.src,
    largeUrl: image.src,
    width: image.width,
    height: image.height,
    alt,
  }
}

export const samplePortfolioProject = {
  id: "sample-portfolio-project",
  slug: "sample-residential-renovation",
  title: "Sample Residential Renovation",
  address: "Raleigh, North Carolina",
  size: "4,200 sq ft",
  shortDescription:
    "A demonstration portfolio page showing how a project can combine a cover image, design narrative, gallery media, and optional video embeds.",
  thumbnail: toImageAsset(portfolioCoverImage, "Rendered perspective of a residential renovation"),
  coverImage: toImageAsset(portfolioCoverImage, "Rendered perspective of a residential renovation"),
  longDescription: `
    <p>This sample project exists so the portfolio can be reviewed locally even when Strapi does not yet contain the portfolio collection or sample entries.</p>
    <p>The page layout is ready for real project content: a hero image, a longer narrative, a gallery grid, optional videos, and summary facts in the sidebar.</p>
    <p>Once live project data is available in Strapi, this sample can be removed or kept as a visual reference for future content entry.</p>
  `,
  folder: {
    id: "sample-folder",
    name: "Sample Media Set",
    path: "/sample-media-set",
  },
  videos: [
    {
      title: "Sample walkthrough video",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
  ],
  images: [
    toImageAsset(portfolioGalleryOne, "Interior sample rendering with layered textures"),
    toImageAsset(portfolioGalleryTwo, "Architectural study image for the sample project"),
  ],
  mapQuery: "Raleigh, North Carolina",
}

export const samplePortfolioProjects = [
  {
    id: samplePortfolioProject.id,
    slug: samplePortfolioProject.slug,
    title: samplePortfolioProject.title,
    address: samplePortfolioProject.address,
    size: samplePortfolioProject.size,
    shortDescription: samplePortfolioProject.shortDescription,
    thumbnail: samplePortfolioProject.thumbnail,
  },
]

export const sampleCaseStudy = {
  id: "sample-case-study",
  type: "case-study",
  slug: "sample-design-process",
  title: "Sample Design Process",
  shortDescription:
    "A demonstration case study showing how long-form editorial content, image sections, and video blocks look inside the new archive.",
  intro:
    "<p>This sample case study keeps the archive visible while the local Strapi collection is still being prepared. It is structured the same way as the real case-study pages, so it is useful for layout review and content planning.</p>",
  thumbnail: toImageAsset(caseStudyImage, "Architectural drawing and material study"),
  coverImage: toImageAsset(caseStudyImage, "Architectural drawing and material study"),
  blocks: [
    {
      id: "sample-case-study-text",
      type: "long-text",
      heading: "Project premise",
      content:
        "<p>This editorial page demonstrates how narrative content can be broken into readable sections instead of a single uninterrupted wall of text.</p><p>It gives you a stable local page to review typography, spacing, imagery, and block order before wiring in final CMS content.</p>",
    },
    {
      id: "sample-case-study-image",
      type: "image",
      heading: "Reference image",
      caption: "A local sample image from the project workspace.",
      image: toImageAsset(caseStudyImage, "Architectural drawing and material study"),
    },
    {
      id: "sample-case-study-video",
      type: "video",
      title: "Presentation clip",
      caption: "Video blocks can reference YouTube or external hosted media.",
      url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    },
  ],
  unsupportedBlockCount: 0,
}

export const sampleCaseStudies = [
  {
    id: sampleCaseStudy.id,
    type: sampleCaseStudy.type,
    slug: sampleCaseStudy.slug,
    title: sampleCaseStudy.title,
    shortDescription: sampleCaseStudy.shortDescription,
    intro: sampleCaseStudy.intro,
    thumbnail: sampleCaseStudy.thumbnail,
    coverImage: sampleCaseStudy.coverImage,
  },
]
