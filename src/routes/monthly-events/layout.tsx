import { component$, Slot } from '@builder.io/qwik'
import { Link, useLocation } from '@builder.io/qwik-city'

export default component$(() => {
  const location = useLocation()
  const is2014 = location.url.pathname.startsWith('/monthly-events/2014/')
  const is2013 = location.url.pathname.startsWith('/monthly-events/2013/')
  const is2012 = location.url.pathname.startsWith('/monthly-events/2012/')
  const is2011 = location.url.pathname.startsWith('/monthly-events/2011/')

  return (
    <div class="flex min-h-full flex-col">
      <div class="flex-1 xl:flex">
        <div class="px-2 xl:w-64 xl:shrink-0">
          <nav class="sticky top-24 flex  flex-1 flex-col" aria-label="Sidebar">
            <ul class="-mx-1 mt-3 first:mt-0 border-collapse" role="list">
              <li class="bg-[url(../../../oceanDark.jpg)] leading-6 rounded-t-md last:rounded-b-md">
                <Link
                  href="/monthly-events/2014/"
                  class={`${
                    is2014 ? 'font-extrabold' : ''
                  } font-bold flex p-2 pl-3 text-white text-sm text-inherit leading-6 hover:font-extrabold hover:no-underline`}
                >
                  2014
                </Link>
              </li>
              {is2014 && (
                <>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2014/12"
                      class={`${
                        location.url.pathname === '/monthly-events/2014/12/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      December
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2014/11"
                      class={`${
                        location.url.pathname === '/monthly-events/2014/11/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      November
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2014/10"
                      class={`${
                        location.url.pathname === '/monthly-events/2014/10/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      Oktober
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2014/9"
                      class={`${
                        location.url.pathname === '/monthly-events/2014/9/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      September
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2014/8"
                      class={`${
                        location.url.pathname === '/monthly-events/2014/8/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      August
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2014/7"
                      class={`${
                        location.url.pathname === '/monthly-events/2014/7/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      July
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2014/6"
                      class={`${
                        location.url.pathname === '/monthly-events/2014/6/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      June
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2014/5"
                      class={`${
                        location.url.pathname === '/monthly-events/2014/5/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      May
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2014/4"
                      class={`${
                        location.url.pathname === '/monthly-events/2014/4/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      April
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2014/3"
                      class={`${
                        location.url.pathname === '/monthly-events/2014/3/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      March
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2014/2"
                      class={`${
                        location.url.pathname === '/monthly-events/2014/2/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      February
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2014/1"
                      class={`${
                        location.url.pathname === '/monthly-events/2014/1/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      January
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <ul class="-mx-1 mt-3 first:mt-0 border-collapse" role="list">
              <li class="bg-[url(../../../oceanDark.jpg)] leading-6 rounded-t-md last:rounded-b-md">
                <Link
                  href="/monthly-events/2013/"
                  class={`${
                    is2013 ? 'font-extrabold' : ''
                  } font-bold flex p-2 pl-3 text-white text-sm text-inherit leading-6 hover:font-extrabold hover:no-underline`}
                >
                  2013
                </Link>
              </li>
              {is2013 && (
                <>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2013/12"
                      class={`${
                        location.url.pathname === '/monthly-events/2013/12/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      December
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2013/11"
                      class={`${
                        location.url.pathname === '/monthly-events/2013/11/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      November
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2013/10"
                      class={`${
                        location.url.pathname === '/monthly-events/2013/10/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      Oktober
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2013/9"
                      class={`${
                        location.url.pathname === '/monthly-events/2013/9/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      September
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2013/8"
                      class={`${
                        location.url.pathname === '/monthly-events/2013/8/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      August
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2013/7"
                      class={`${
                        location.url.pathname === '/monthly-events/2013/7/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      July
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2013/6"
                      class={`${
                        location.url.pathname === '/monthly-events/2013/6/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      June
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2013/5"
                      class={`${
                        location.url.pathname === '/monthly-events/2013/5/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      May
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2013/4"
                      class={`${
                        location.url.pathname === '/monthly-events/2013/4/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      April
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2013/3"
                      class={`${
                        location.url.pathname === '/monthly-events/2013/3/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      March
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2013/2"
                      class={`${
                        location.url.pathname === '/monthly-events/2013/2/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      February
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2013/1"
                      class={`${
                        location.url.pathname === '/monthly-events/2013/1/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      January
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <ul class="-mx-1 mt-3 first:mt-0 border-collapse" role="list">
              <li class="bg-[url(../../../oceanDark.jpg)] leading-6 rounded-t-md last:rounded-b-md">
                <Link
                  href="/monthly-events/2012/"
                  class={`${
                    is2012 ? 'font-extrabold' : ''
                  } font-bold flex p-2 pl-3 text-white text-sm text-inherit leading-6 hover:font-extrabold hover:no-underline`}
                >
                  2012
                </Link>
              </li>
              {is2012 && (
                <>
                  {' '}
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2012/12"
                      class={`${
                        location.url.pathname === '/monthly-events/2012/12/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      December
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2012/11"
                      class={`${
                        location.url.pathname === '/monthly-events/2012/11/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      November
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2012/10"
                      class={`${
                        location.url.pathname === '/monthly-events/2012/10/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      Oktober
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2012/9"
                      class={`${
                        location.url.pathname === '/monthly-events/2012/9/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      September
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2012/8"
                      class={`${
                        location.url.pathname === '/monthly-events/2012/8/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      August
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2012/7"
                      class={`${
                        location.url.pathname === '/monthly-events/2012/7/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      July
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2012/6"
                      class={`${
                        location.url.pathname === '/monthly-events/2012/6/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      June
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2012/5"
                      class={`${
                        location.url.pathname === '/monthly-events/2012/5/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      May
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2012/4"
                      class={`${
                        location.url.pathname === '/monthly-events/2012/4/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      April
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2012/3"
                      class={`${
                        location.url.pathname === '/monthly-events/2012/3/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      March
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2012/2"
                      class={`${
                        location.url.pathname === '/monthly-events/2012/2/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      February
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2012/1"
                      class={`${
                        location.url.pathname === '/monthly-events/2012/1/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      January
                    </Link>
                  </li>
                </>
              )}
            </ul>
            <ul class="-mx-1 mt-3 first:mt-0 border-collapse" role="list">
              <li class="bg-[url(../../../oceanDark.jpg)] leading-6 rounded-t-md last:rounded-b-md">
                <Link
                  href="/monthly-events/2011/"
                  class={`${
                    is2011 ? 'font-extrabold' : ''
                  } font-bold flex p-2 pl-3 text-white text-sm text-inherit leading-6 hover:font-extrabold hover:no-underline`}
                >
                  2011
                </Link>
              </li>
              {is2011 && (
                <>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2011/12"
                      class={`${
                        location.url.pathname === '/monthly-events/2011/12/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      December
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2011/11"
                      class={`${
                        location.url.pathname === '/monthly-events/2011/11/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      November
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2011/10"
                      class={`${
                        location.url.pathname === '/monthly-events/2011/10/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      Oktober
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2011/9"
                      class={`${
                        location.url.pathname === '/monthly-events/2011/9/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      September
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2011/8"
                      class={`${
                        location.url.pathname === '/monthly-events/2011/8/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      August
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2011/7"
                      class={`${
                        location.url.pathname === '/monthly-events/2011/7/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      July
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2011/6"
                      class={`${
                        location.url.pathname === '/monthly-events/2011/6/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      June
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2011/5"
                      class={`${
                        location.url.pathname === '/monthly-events/2011/5/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      May
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2011/4"
                      class={`${
                        location.url.pathname === '/monthly-events/2011/4/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      April
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2011/3"
                      class={`${
                        location.url.pathname === '/monthly-events/2011/3/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      March
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2011/2"
                      class={`${
                        location.url.pathname === '/monthly-events/2011/2/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      February
                    </Link>
                  </li>
                  <li class="border border-slate-200 last:rounded-b-md">
                    <Link
                      href="/monthly-events/2011/1"
                      class={`${
                        location.url.pathname === '/monthly-events/2011/1/'
                          ? 'font-extrabold bg-slate-100'
                          : ''
                      } font-bold flex p-2 pl-3 text-sm text-inherit leading-6 hover:font-extrabold hover:bg-slate-100 hover:no-underline`}
                    >
                      January
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
        <div class="px-2 xl:flex-1">
          <Slot />
        </div>
      </div>
    </div>
  )
})
