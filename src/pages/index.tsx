import { Inter } from "next/font/google";
import MyCarousel from "@/MYCOMPONENT/Carousell";
import StaffContainer from "@/MYCOMPONENT/sidemenu/Staff/StaffContainer";
import Navbar from "@/MYCOMPONENT/navbar/navbar";
import { usesetTopic, useUser } from "@/hooks/store/useUser";
import SkeletonCard from "@/MYCOMPONENT/article/cardSeleton";
import { useEffect } from "react";
import CardArticle from "@/MYCOMPONENT/article/article";
import Hoc from "@/hoc/Hoc";
import Footer from "@/MYCOMPONENT/MyFooter";
import { toast } from "sonner";
import { useHandleGet } from "@/lib/useGet";
import { useHandlePost } from "@/lib/useHandlePost";
import ArticleSkeleton from "@/MYCOMPONENT/article/articleSkeleton";

const inter = Inter({ subsets: ["latin"] });

export type article = {
  id: number;
  title: string;
  article: string;
  description: string;
  author_name: string;
  img_user: string;
  likes: number;
  comments: string | null;
  date: string;
  img_content: string;
  type: string;
};

type uploadUser = {
  name: string | undefined | null;
  pronouns: string;
  short_bio: string;
  email: string | undefined | null;
  profil_img: string | undefined | null;
};

function Home() {
  //store
  const { topic } = usesetTopic();
  const { user, setUser } = useUser();
  // feaching
  const { mutate, isSuccess: success_upload_user } = useHandlePost<uploadUser>(
    "/feature/profil-user/upload",
  );
  const { data: articles, isLoading, isError } = useHandleGet("/", topic);
  const { data } = useHandleGet(
    "/feature/getuser/",
    user.email,
    success_upload_user,
  );

  useEffect(() => {
    if (data) {
      setUser(data?.user[0]);
    }
  }, []);

  const value = {
    name: user?.displayName,
    pronouns: "writer",
    short_bio: "",
    email: user?.email,
    profil_img: user?.photoURL,
  };

  useEffect(() => {
    if (user && value) {
      mutate(value, {
        onSuccess: () => {
          toast.success("your are login");
        },
      });
    }
  }, [user]);

  console.log(user);

  if (isError) toast.error("failed to load article");

  return (
    <>
      <div className="relative h-full min-h-[87vh]">
        <header>
          <Navbar />
        </header>
        <main
          className={`flex w-svw flex-col items-center justify-between px-4 md:w-full ${inter.className} main mx-auto pt-4 lg:container`}
        >
          <div className="md:nav mx-auto block w-full md:w-4/5 md:max-w-4xl">
            <MyCarousel />
          </div>

          <section className="content w-full space-y-4 border-slate-100 pt-6 md:container md:max-w-4xl md:border-e">
            {!articles && isLoading ? (
              <SkeletonCard />
            ) : (
              <CardArticle articles={articles} />
            )}
          </section>

          <div className="md:sidebar relative h-full w-full pt-6 md:block md:ps-8">
            <StaffContainer />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default Hoc(Home);
