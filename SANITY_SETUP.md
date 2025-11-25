# Sanity CMS Setup Guide

This guide will help you set up Sanity CMS for managing blog content on Life By Design.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

## Step 1: Create a Sanity Project

1. Go to [sanity.io](https://www.sanity.io) and sign up for a free account
2. Create a new project with these settings:
   - **Project Name:** Life By Design
   - **Dataset name:** production
   - **Visibility:** Public (API readable)
3. After creation, you'll get your `PROJECT_ID` and confirm your dataset is `production`

## Step 2: Add Environment Variables

In the Vercel project, add these environment variables in the **Vars** section:

\`\`\`
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID_HERE
NEXT_PUBLIC_SANITY_DATASET=production
\`\`\`

Replace `YOUR_PROJECT_ID_HERE` with your actual Sanity project ID.

## Step 3: Install Dependencies

Run this command to install Sanity dependencies:

\`\`\`bash
npm install next-sanity @sanity/image-url @portabletext/react
npm install -D sanity @sanity/cli
\`\`\`

## Step 4: Deploy Schema to Sanity

Deploy the blog schema we've created:

\`\`\`bash
npx sanity deploy
\`\`\`

This will push the blog post and author schemas to your Sanity project.

## Step 5: Access Sanity Studio

Your team can now access the content editor at:

\`\`\`
https://YOUR_PROJECT_ID.sanity.studio
\`\`\`

## Managing Blog Content

### Creating a Blog Post

1. Go to Sanity Studio
2. Click **Blog Posts** in the left sidebar
3. Click **Create** button
4. Fill in the following fields:
   - **Title:** Post title
   - **Slug:** Auto-generates from title (can edit manually)
   - **Author:** Select or create an author
   - **Published At:** Date of publication (auto-set to current date)
   - **Featured Image:** Upload a cover image
   - **Description:** Short excerpt for the blog listing
   - **Content:** Full article content with rich text formatting
   - **Category:** Select from Business Strategy, Entrepreneurship, Design, Leadership, or Case Study
   - **Published:** Toggle to publish (required for posts to appear on site)

### Editing an Existing Post

1. Go to Sanity Studio
2. Click **Blog Posts**
3. Find and click the post you want to edit
4. Make your changes
5. Click **Publish** when done

### Managing Authors

1. Go to Sanity Studio
2. Click **Authors** in the left sidebar
3. Create or edit author profiles with:
   - Name
   - Email
   - Profile image
   - Bio

## How It Works

- Only posts with **Published** toggled ON will appear on the website
- Posts are automatically sorted by newest first
- The blog page filters by category
- Published posts are cached and revalidate daily (or on-demand)

## Troubleshooting

**Posts not showing on website?**
- Make sure the post is marked as **Published** in Sanity Studio
- Check that `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are set correctly
- Wait a few seconds for the cache to revalidate

**Images not loading?**
- Ensure you've uploaded images through Sanity Studio (don't use external URLs)
- Check that your Sanity dataset is set to **Public** for API access

**Can't access Sanity Studio?**
- Verify your PROJECT_ID is correct
- Make sure you're logged into your Sanity account

## Support

For more information, visit the [Sanity documentation](https://www.sanity.io/docs).