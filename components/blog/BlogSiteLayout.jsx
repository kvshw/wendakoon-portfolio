"use client";

import { Chat } from "@/components/Chat";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";

/** Main-site chrome for `/blog` routes (nav links back to homepage sections). */
export const BlogSiteLayout = ({ children }) => (
  <>
    <ScrollProgress />
    <Nav active="blog" standalone />
    <main id="top">{children}</main>
    <Footer standalone />
    <Chat />
  </>
);
