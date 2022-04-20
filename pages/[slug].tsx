import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react';
import styles from '../styles/slug.module.css'
import { fetchFromPrismic } from '../api/prismic'
import { PrismicRichText } from '@prismicio/react';
import { asText } from '@prismicio/helpers'
import Accordion from './Accordion'

type PrismicResponse = any;

function Page({page}: any){
	const [isActive, setIsActive] = useState(false);
	const accordionData = page.accordion;
	return (
		<div>
			
			<PrismicRichText field={page.title} />	
			<Link href='/'>
				<a>Forsíða</a>
			</Link>
			<PrismicRichText field={page.content} />
			<div className={styles.accordion}>
				{accordionData.map(function(item: any, i: number){
					return(
          				<Accordion title={item.accordiontitle[0].text} content={item.accordiontext[0].text} />
          			)
        		})}
			</div>

		</div>
	);
}

const query = `
	query{
		allPages{
    		edges{
    		  node{
    		    _meta{
    		      uid
    		    }
    		  }
    		}
  		}
	}
`;

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const result = await fetchFromPrismic<PrismicResponse>(query);
  // Get the paths we want to pre-render based on posts
  const paths = result.allPages.edges.map((page: any) => ({
    params: { slug: page.node._meta.uid },
  }))
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}

const query2 = `
query($uid: String = ""){
  page(uid:$uid, lang:"is") {
    title
    content
    image
    accordion{
        accordiontitle
        accordiontext
      }
    _linkType
  }
}
`;

export async function getStaticProps({ params }: any) {
  const uid = params.slug;
  const result = await fetchFromPrismic<PrismicResponse>(query2, { uid })
  // Pass post data to the page via props
  const page = result.page
  return { props: { page } }
}
export default Page