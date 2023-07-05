import { component$ } from '@builder.io/qwik'

export default component$(() => {
  return (
    <div>
      <div class="text-lg text-center pt-2 pb-4">
        <span class="font-bold">S</span>earch <span class="font-bold">A</span>nd{' '}
        <span class="font-bold">R</span>escue
        <span class="font-bold ms-4">N</span>
        on-
        <span class="font-bold">G</span>overnmental{' '}
        <span class="font-bold">O</span>rganisation
        <span class="font-bold">s</span>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="relative flex flex-col items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 text-center">
          <h3 class="text-2xl text-blue-800 no-underline hover:underline text-center">
            <a
              href="https://de.wikipedia.org/wiki/SOS M%C3%A9diterran%C3%A9e"
              target="_blank"
              rel="noreferrer"
            >
              SOS Mediterranée
            </a>
          </h3>
          <div>Internat. NGO, Marseille, 2015 –</div>
          <div>2019-2020 cooperation with MsF</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a
              href="https://de.wikipedia.org/wiki/Ocean_Viking"
              target="_blank"
              rel="noreferrer"
            >
              Ocean Viking
            </a>
          </h3>
          <div>Norwegian flag, 2019 –</div>
          <div>8 SAR operations in 2021</div>
        </div>
        <div class="relative flex flex-col items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 text-center">
          <h3 class="text-2xl text-blue-800 no-underline hover:underline text-center">
            <a
              href="https://en.wikipedia.org/wiki/M%C3%A9decins Sans Fronti%C3%A8res"
              target="_blank"
              rel="noreferrer"
            >
              Médecins sans Frontières (MsF)
            </a>
          </h3>
          <div>International NGO, SAR 2015 –</div>
          <div>2019-2020 coop. with SOS Mediterranée</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a
              href="https://de.wikipedia.org/wiki/Geo_Barents"
              target="_blank"
              rel="noreferrer"
            >
              Geo Barents
            </a>
          </h3>
          <div>Norwegian flag, 2021 –</div>
          <div>6 SAR operations in 2021</div>
        </div>
        <div class="relative flex flex-col items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 text-center">
          <h3 class="text-2xl text-blue-800 no-underline hover:underline text-center">
            <a
              href="https://sos-humanity.org/en/about-us/"
              target="_blank"
              rel="noreferrer"
            >
              SOS Humanity
            </a>
          </h3>
          <div>German NGO, 2015 –</div>
          <div>{'2016-21 part of SOS Mediterranee Network'}</div>
          <div>{'with ‘Aquarius’ & ‘Ocean Viking’'}</div>
          <div>{'Now seeking EU coordination'}</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a
              href="https://sos-humanity.org/en/press/rescue-vessel-humanity-1-departed-for-central-mediterranean/"
              target="_blank"
              rel="noreferrer"
            >
              Humanity 1
            </a>
          </h3>
          <div>German flag, Kiel 2021</div>
          <div>SAR operations start August 2022</div>
        </div>
        <div class="relative flex flex-col items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 text-center">
          <h3 class="text-2xl text-blue-800 no-underline hover:underline text-center">
            <a
              href="https://de.wikipedia.org/wiki/Sea-Watch"
              target="_blank"
              rel="noreferrer"
            >
              Sea Watch
            </a>
          </h3>
          <div>German NGO, 2015 –</div>
          <div>{'coop. with Open Arms & Mediterranea (MSH)'}</div>
          <div>use of airplanes</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a
              href="https://de.wikipedia.org/wiki/Sea-Watch_3"
              target="_blank"
              rel="noreferrer"
            >
              Sea Watch 3
            </a>
          </h3>
          <div>German flag, 2017 –</div>
          <div>4 SAR operations in 2021</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a
              href="https://de.wikipedia.org/wiki/Sea-Watch_4"
              target="_blank"
              rel="noreferrer"
            >
              Sea Watch 4
            </a>
          </h3>
          <div>German flag, 2020 –</div>
          <div>4 SAR operations in 2021</div>
        </div>
        <div class="relative flex flex-col items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 text-center">
          <h3 class="text-2xl text-blue-800 no-underline hover:underline text-center">
            <a
              href="https://de.wikipedia.org/wiki/Mission_Lifeline"
              target="_blank"
              rel="noreferrer"
            >
              Mission Lifeline
            </a>
          </h3>
          <div>German NGO, Dresden, 2016 -</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a
              href="https://mission-lifeline.de/das-jahr-der-rise-above"
              target="_blank"
              rel="noreferrer"
            >
              Rise Above
            </a>
          </h3>
          <div>2021 - (flag?)</div>
          <div>‘Eleonore’ 2019 -</div>
          <div>‘Lifeline’ 2016 –</div>
        </div>
        <div class="relative flex flex-col items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 text-center">
          <h3 class="text-2xl text-blue-800 no-underline hover:underline text-center">
            <a
              href="https://en.wikipedia.org/wiki/Emergency_(organization)#Italy"
              target="_blank"
              rel="noreferrer"
            >
              Emergency
            </a>
          </h3>
          <div>International NGO, Milan, 1994 –</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a
              href="https://reliefweb.int/report/world/emergency-ngo-search-and-rescue-ship-life-support-embarks-inaugural-mission-central-mediterranean-sea"
              target="_blank"
              rel="noreferrer"
            >
              Life Support
            </a>
          </h3>
          <div>Italian flag (?)</div>
          <div>SAR December 2022 –</div>
        </div>
        <div class="relative flex flex-col items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 text-center">
          <h3 class="text-2xl text-blue-800 no-underline hover:underline text-center">
            <a
              href="https://de.wikipedia.org/wiki/Sea-Eye"
              target="_blank"
              rel="noreferrer"
            >
              Sea Eye
            </a>
          </h3>
          <div>German NGO, 2015 –</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a
              href="https://de.wikipedia.org/wiki/Sea-Eye_4"
              target="_blank"
              rel="noreferrer"
            >
              Sea Eye 4
            </a>
          </h3>
          <div>German flag, 2021 –</div>
          <div>3 SAR operations in 2021</div>
        </div>
        <div class="relative flex flex-col items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 text-center">
          <h3 class="text-2xl text-blue-800 no-underline hover:underline text-center">
            <a
              href="https://en.wikipedia.org/wiki/Proactiva_Open_Arms"
              target="_blank"
              rel="noreferrer"
            >
              Proactiva Open Arms
            </a>
          </h3>
          <div>Spanish NGO, 2015 –</div>
          <div>coop. with Sea Watch and Mediterranea (MSH)</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a
              href="https://de.wikipedia.org/wiki/Open_Arms"
              target="_blank"
              rel="noreferrer"
            >
              Open Arms
            </a>
          </h3>
          <div>Spanish flag, 2017 –</div>
          <div>3 SAR operations in 2021</div>
        </div>
        <div class="relative flex flex-col items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 text-center">
          <h3 class="text-2xl text-blue-800 no-underline hover:underline text-center">
            <a
              href="https://www.infomigrants.net/en/post/26362/italian-migrant-rescue-boat-resqpeople-project-launched"
              target="_blank"
              rel="noreferrer"
            >
              ResQ – People Saving People
            </a>
          </h3>
          <div>Italian NGO, 2020 –</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a href="https://resq.it/progetto" target="_blank" rel="noreferrer">
              ResQ People
            </a>
          </h3>
          <div>Italian flag, 2020 –</div>
          <div>1 SAR operation in 2021</div>
        </div>
        <div class="relative flex flex-col items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 text-center">
          <h3 class="text-2xl text-blue-800 no-underline hover:underline text-center">
            <a
              href="https://en.wikipedia.org/wiki/Salvamento_Mar%C3%ADtimo_Humanitario"
              target="_blank"
              rel="noreferrer"
            >
              Salvamento Maritimo Humanitario - SMH
            </a>
          </h3>
          <div>Spanish NGO, 2015 –</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a
              href="https://en.wikipedia.org/wiki/Aita_Mari"
              target="_blank"
              rel="noreferrer"
            >
              Aita Mari
            </a>
          </h3>
          <div>Spanish flag, 2018 –</div>
          <div>1 SAR operation in 2021</div>
        </div>
        <div class="relative flex flex-col items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 text-center">
          <h3 class="text-2xl text-blue-800 no-underline hover:underline text-center">
            <a
              href="https://en.wikipedia.org/wiki/Louise_Michel_(ship)"
              target="_blank"
              rel="noreferrer"
            >
              Banksy
            </a>
          </h3>
          <div>British artist-activist, 2019/20 –</div>
          <div>{'coop. with Sea Watch & Mare Jonio'}</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a
              href="https://en.wikipedia.org/wiki/Louise_Michel_(ship)"
              target="_blank"
              rel="noreferrer"
            >
              Louise Michel
            </a>
          </h3>
          <div>German flag, 2020 –</div>
          <div>no SAR operation in 2021</div>
          <div>one in January 2022</div>
        </div>
        <div class="relative flex flex-col items-center justify-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 text-center">
          <h3 class="text-2xl text-blue-800 no-underline hover:underline text-center">
            <a
              href="https://en.wikipedia.org/wiki/Mediterranea_Saving_Humans"
              target="_blank"
              rel="noreferrer"
            >
              Mediterranea Saving Humans (MSH)
            </a>
          </h3>
          <div>Italian NGO, 2018 –</div>
          <div>coop. with Sea Watch and Open Arms</div>
          <h3 class="text-2xl text-blue-800 no-underline hover:underline before:content-['⚓_\''] after:content-['\''] mt-3">
            <a
              href="https://en.wikipedia.org/wiki/Mare_Jonio_(rescue_ship)"
              target="_blank"
              rel="noreferrer"
            >
              Mare Jonio
            </a>
          </h3>
          <div>Italian flag, 2018 –</div>
          <div>no SAR operation in 2021</div>
          <div>one in January 2022</div>
        </div>
      </div>
    </div>
  )
})
