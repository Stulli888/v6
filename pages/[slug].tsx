import { useRouter } from 'next/router'
import Head from 'next/head'
import { fetchFromPrismic } from '../api/prismic';
import { asText } from '@prismicio/helpers';

type PrismicResponse = any;

function Page({result}: any){
	console.log('res: ',result)
	console.log('t: ',result.page.title[0].text)
	return (
		<h1>{result.page.title[0].text}</h1>
		);
}

const query = `
	query{
		allPages{
    		edges{
    		  node{
    		    title
    		    linkhome{
    		      _linkType
    		      __typename
    		    }
    		    content
    		    image
    		    _meta{
    		      id
    		      uid
    		      type
    		      tags
    		      lang
    		    }
    		    _linkType
    		  }
    		}
  		}
	}
`;

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const result = await fetchFromPrismic<PrismicResponse>(query);
  //console.log('edges >> ',result.allPages?.edges);
  //const pages = await result.json()
  //console.log(pages);
  //const p = pages.items

  // Get the paths we want to pre-render based on posts
  const paths = result.allPages.edges.map((page: any) => ({
    params: { slug: page.node._meta.uid },
  }))
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }

  //return { paths: [{params: {slug: '/slug'}}], fallback: true }
}

const query2 = `
query($uid: String = ""){
  page(uid:$uid, lang:"is") {
    title
    content
    image
    _linkType
  }
}
`;

export async function getStaticProps({ params }: any) {
  const uid = params.slug;
  console.log('uid: ', uid)
  const result = await fetchFromPrismic<PrismicResponse>(query2, { uid })
  // Pass post data to the page via props
  return { props: { result } }
}
export default Page