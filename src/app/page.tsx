import Image from "next/image";
import Link from "next/link";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Open Doors of IIT With JEEone
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Unlock your full potential with our comprehensive practice
                    questions across physics, chemistry, and math.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/problems"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Start Learning
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1504275107627-0c2ba7a43dba?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-12 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Physics, Chemistry, and Math
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Practice Questions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Strengthen your understanding of physics, chemistry, and math
                  concepts with our curated collection of practice questions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <Link
                      href="/problems"
                      className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      prefetch={false}
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Physics
                      </div>
                      <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Practice questions on kinematics, dynamics, waves,
                        optics etc.
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/problems"
                      className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      prefetch={false}
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Chemistry
                      </div>
                      <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Practice questions on atomic structure, chemical
                        bonding, thermodynamics etc.
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/problems"
                      className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      prefetch={false}
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        Mathematics
                      </div>
                      <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Practice questions on algebra, geometry, calculus etc.
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              <Image
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8U3R1ZGVudHxlbnwwfHwwfHx8MA%3D%3D"
                width="550"
                height="310"
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-12 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  JEE Mains and JEE Advanced
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Practice for Exams
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Prepare for the JEE Mains and JEE Advanced exams with our
                  comprehensive practice questions covering a wide range of
                  topics.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                src="https://png.pngtree.com/thumb_back/fh260/background/20230610/pngtree-this-image-displays-an-empty-room-full-of-people-trying-to-image_2950957.jpg"
                width="550"
                height="310"
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full "
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <Link
                      href="/exam"
                      className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      prefetch={false}
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        JEE Mains
                      </div>
                      <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Practice questions to prepare for the JEE Mains exam.
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/exam"
                      className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                      prefetch={false}
                    >
                      <div className="text-sm font-medium leading-none group-hover:underline">
                        JEE Advanced
                      </div>
                      <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Practice questions to prepare for the JEE Advanced exam.
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
