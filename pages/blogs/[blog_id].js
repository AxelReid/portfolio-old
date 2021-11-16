import React from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import style from 'styles/blog_expended.module.scss'
import Component from '@/components/Component'
import { blogsPath, BLOG_DETAILS } from '@/lib/mdxUtils'
import Pic from 'public/images/pic.jpg'

import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'

export function getStaticPaths() {
  const paths = blogsPath
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((blog_id) => ({ params: { blog_id } }))
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params: { blog_id } }) {
  const source = BLOG_DETAILS(blog_id)

  const { content, data } = matter(source)

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: data,
  })

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  }
}

const components = {
  Image,
  CustomImage: dynamic(() => import('@/components/CustomImage')),
}

const Blog = ({ source, frontMatter }) => {
  return (
    <Component title='A blog' desc='The blog desciption'>
      <div className={style.blog_expended}>
        <h1 className='big-title'>{frontMatter.title}</h1>
        <article>
          <div data-pic>
            <Image src={Pic} alt='profile image'></Image>
          </div>
          <p>Anvarbekov Asilbek - Nov 9, 2021</p>
        </article>
        <section data-mdx-wrapper>
          <MDXRemote {...source} components={components} />
        </section>
      </div>
    </Component>
  )
}

export default Blog
