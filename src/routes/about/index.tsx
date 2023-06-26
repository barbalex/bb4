import {
  component$,
  useResource$,
  Resource,
  useContext,
} from '@builder.io/qwik'
import { server$ } from '@builder.io/qwik-city'

import * as db from '~/db'
import { CTX } from '~/root'
import Editing from './editing'

// select all articles: id, title, draft
const dataFetcher = server$(async function () {
  console.log('about, dataFetcher running')
  let res
  try {
    res = await db.query(
      `select content from page where id = '24c9db53-6d7d-4a97-98b4-666c9aaa85c9'`,
    )
  } catch (error) {
    console.error('query error', error.stack)
  }

  // console.log('article, dataFetcher, res:', res)
  const about = res?.rows[0]?.content
  if (!about) return null

  return about.toString('utf-8')
})

export default component$(() => {
  const store = useContext(CTX)
  const about = useResource$(async ({ track }) => {
    track(() => store.aboutRefetcher)

    return await dataFetcher()
  })

  return (
    <Resource
      value={about}
      onPending={() => <div>Loading...</div>}
      onRejected={(reason) => {
        console.log('reason:', reason)
        return <div>Error: {reason}</div>
      }}
      onResolved={(about) => {
        console.log('about resource rendering')
        if (store.editing) return <Editing about={about} />

        return <div class="about" dangerouslySetInnerHTML={about}></div>
      }}
    />
  )

  // return (
  //   <>
  //     <h2 class="text-center text-2xl font-bold text-2xl my-3">
  //       Personal Motivation
  //     </h2>
  //     <p class="text-left">
  //       Some may wonder why this website should be edited by a Swiss living in a
  //       country with green borders only and no direct access to the
  //       Mediterranean. There are reasons. I spent the last three years of my
  //       academic career in Malta witnessing firsthand the various aspects of
  //       blue border migration. That was before the Arab Spring but, given my
  //       background in international politics, it impressed me no end. When 2011
  //       came around I decided to follow events more closely, abroad and at home.
  //       It is a fact that thousands of migrants and refugees seeking asylum in
  //       our country have crossed the Mediterranean. And, in 2008, Switzerland
  //       became an associate member of the Schengen area. Although not in the EU,
  //       the country is integrated when it comes to handling cross-border
  //       mobility. Our responsibilities, as a result, have widened - and often
  //       extend to the blue waters of the Mediterranean. The Swiss Minister of
  //       the Interior attends EU Council meetings, Swiss border guards work for
  //       Frontex in various capacities. Some are at headquarters in Warsaw but
  //       others are active in the field, including 'hotspots' in Italy and
  //       Greece.&nbsp;
  //     </p>
  //     <h2 class="text-center text-2xl font-bold text-2xl my-3">
  //       Migratory Dynamics
  //     </h2>
  //     <p>
  //       As mentioned, I started this website in 2011 with the advent of the Arab
  //       Spring and a focus on the <strong>Central Mediterranean</strong>. The
  //       reason was simple: Most migrants reaching Europe left from Libya and
  //       landed in Italy. The flow was constant and, at times, made world
  //       headlines. It was the case in early October 2013 when around 360
  //       migrants died in a tragic accident close to the coast of Lampedusa. As a
  //       consequence the Italian government stepped up its SAR activities and
  //       launched 'Mare Nostrum', a massive maritime operation that, unlike the
  //       Guardia Costiera and the Guardia di Finanza, was run by the navy and
  //       involved the use of large amphibious war ships. The action was
  //       impressive. A year later, and to ease Italy's burden, the EU started
  //       Operation 'Triton'.
  //     </p>
  //     <p>
  //       Since most disembarkations continued to take place at Sicilian ports the
  //       problems associated with migration continued to have a distinctly
  //       Italian character. That changed in 2015 when around a million boat
  //       people crossed the waters separating Turkey and the Greek islands. Most
  //       of them fled from war-torn countries like Syria, Irak and Afghanistan.
  //       Within a few months Europe was confronted with a new set of problems, at
  //       the shores of Greece, along the Balkan route and at national borders.
  //       Germany felt the pressure most. The focus was now on the{' '}
  //       <strong>Eastern Mediterranean</strong>. But not for long. 180'000
  //       migrants landed in Italy in 2016, and 120'000 in 2017. Spain, too,
  //       registered an increasing number of arrivals. The European discourse
  //       widened, Brussels felt the pressure - and the language became truly
  //       political.&nbsp;&nbsp;
  //     </p>
  //     <p>&nbsp;</p>
  //     <h2 class="text-center text-2xl font-bold text-2xl my-3">
  //       Maritime &amp; Political Events&nbsp;
  //     </h2>
  //     <p>
  //       As a result of the new situation I decided, in 2015, to change the
  //       make-up of this website<strong>.</strong>The presentation is still
  //       chronological but the focus is on maritime{' '}
  //       <strong>and political</strong> events. As in the past, the issues
  //       typical of <strong>maritime events</strong> are embarkation, vessels
  //       used, equipment, accidents, search and rescue (SAR) operations, victims
  //       and disembarkation. By <strong>political events</strong> I mean the
  //       reactions and actions undertaken by national, regional and global
  //       actors, including NGOs. Relevant information about the politics of
  //       countries along the southern and eastern rim of the Mediterranean is
  //       covered as well. The conflict in Libya remains the most salient example,
  //       but other developments are important, too.
  //     </p>
  //     <p>
  //       Increasingly the emphasis is also on <strong>European politics</strong>,
  //       on individual states and, of course, on the{' '}
  //       <strong>European Union</strong>. The problems confronted are multiple.
  //       Border management, both maritime and continental, is a major issue.
  //       Differently put, the EU has to find new ways to organize the interplay
  //       of internal and external borders. Add to this the common organization of
  //       disembarkation, the redefinition of the Dublin First Country rule, the
  //       efficient handling of asylum applications, the difficult issue of
  //       repatriation and, finally, the relocation of accepted refugees. Many of
  //       the points touch matters of national sovereignty, thereby going to the
  //       heart of politics. Matteo Salvini's performance is an example. It is
  //       true that for a year he managed to tighten the external maritime borders
  //       of Italy and to enforce relocation but his populist-nationalist style
  //       hurt European solidarity and integration. Although the EU has recently
  //       taken steps to gradually build a 'coalition of the willing' it will take
  //       time to arrive at effective solutions.
  //     </p>
  //     <div class="overflow-hidden rounded-lg bg-white shadow my-6">
  //       <div class="px-4 py-5 sm:px-6">
  //         <h2 class="text-center text-2xl font-bold text-2xl">Editor</h2>
  //       </div>
  //       <div class="px-4 py-5 sm:p-6">
  //         <div class="flex content-center justify-center gap-x-3">
  //           <div class="flex flex-col justify-center w-96">
  //             <p>Jürg Martin GABRIEL</p>
  //             <p>Professor Emeritus</p>
  //             <p>
  //               Swiss Federal Institute of Technology (
  //               <a href="https://www.ethz.ch/en/the-eth-zurich/portrait.html">
  //                 ETHZ
  //               </a>
  //               )
  //             </p>
  //             <p>Zurich, Switzerland</p>
  //           </div>
  //           <img
  //             src="https://ucarecdn.com/2eb7cc96-8cb3-4a1e-8d01-5749aa4c90fa/about_us1.jpg"
  //             alt="about us1"
  //             width={337}
  //             height={150}
  //             class="w-96"
  //           />
  //         </div>
  //       </div>
  //     </div>
  //     <div class="overflow-hidden rounded-lg bg-white shadow my-3">
  //       <div class="px-4 py-5 sm:px-6">
  //         <h2 class="text-center text-2xl font-bold text-2xl">Affiliation</h2>
  //       </div>
  //       <div class="px-4 py-5 sm:p-6">
  //         <div class="flex content-center justify-center gap-x-3">
  //           <div class="flex flex-col justify-center w-96">
  //             <p>
  //               Mediterranean Academy of Diplomatic Studies (
  //               <a href="http://www.um.edu.mt/medac">MEDAC</a>)
  //             </p>
  //             <p>University of Malta</p>
  //             <p>Vice-Chairman of the Board 2008-2018</p>
  //             <p>Director 2002-2005</p>
  //           </div>
  //           <img
  //             src="https://ucarecdn.com/e9b5d80f-a2c5-459f-9e57-24a2ed521005/about_us2.jpg"
  //             alt="about us2"
  //             width={337}
  //             height={150}
  //             class="w-96"
  //           />
  //         </div>
  //       </div>
  //     </div>
  //     <div class="overflow-hidden rounded-lg bg-white shadow my-3">
  //       <div class="px-4 py-5 sm:px-6">
  //         <h2 class="text-center text-2xl font-bold text-2xl">IT - SUPPORT</h2>
  //       </div>
  //       <div class="px-4 py-5 sm:p-6">
  //         <div class="flex content-center justify-center gap-x-3">
  //           <div class="flex flex-col justify-center w-96">
  //             <p>Gabriel Software</p>
  //             <p>079 372 51 64</p>
  //             <a href="mailto:">alex@gabriel-software.ch</a>
  //           </div>
  //           <div class="w-96">
  //             <a
  //               href="https://gabriel-software.ch"
  //               target="_blank"
  //               rel="noopener"
  //             >
  //               <img
  //                 src="https://ucarecdn.com/77eefaf8-e548-4dee-865d-dfc6bf603f53/gs.png"
  //                 alt="Webseite öffnen"
  //                 width={337}
  //                 height={150}
  //               />
  //             </a>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // )
})
