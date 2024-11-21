import {Metadata} from "next";
import {notFound} from "next/navigation";
import markdownStyles from "./markdown-styles.module.css";
import {getAllPosts, getPostBySlug} from "@/lib/blog/api";
import markdownToHtml from "../../../lib/blog/markdownToHtml";
// import Alert from "../../../app/_components/alert";
// import Container from "../../../app/_components/container";
// import Header from "../../../app/_components/header";
import {PostBody} from "../../../app/_components/post-body";
// import {PostHeader} from "../../../app/_components/post-header";

export default async function Post(props: Params) {
    const params = await props.params;
    const post = getPostBySlug(params.slug);

    if (!post) {
        return notFound();
    }

    const content = await markdownToHtml(post.content || "");

    return (
        <main>
            <article className="mb-32">
                <header>
                    <h1
                        className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left"
                    >{post.title}
                        <div className="mb-6 text-lg">
                            <time dateTime="">    {post.date}</time>
                        </div>
                    </h1>
                </header>
                <PostBody content={content}/>
                {/*<PostHeader*/}
                {/*    title={post.title}*/}
                {/*    coverImage={post.coverImage}*/}
                {/*    date={post.date}*/}
                {/*    author={post.author}*/}
                {/*/>*/}
                {/*<PostBody content={content}/>*/}
            </article>
        </main>
    )
        ;
}

type Params = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
    const params = await props.params;
    const post = getPostBySlug(params.slug);

    if (!post) {
        return notFound();
    }

    const title = post.title;

    return {
        title,
        openGraph: {
            title,
            images: [post.ogImage.url],
        },
    };
}

export async function generateStaticParams() {
    const posts = getAllPosts();

    return posts.map((post) => ({
        slug: post.slug,
    }));
}