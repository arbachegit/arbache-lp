'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'
import { useCounterAnimation } from '@/hooks/useCounterAnimation'
import { cn } from '@/lib/utils'

// ─── Icons ───────────────────────────────────────────────

const MissaoIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="14" cy="14" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="14" cy="14" r="2.5" fill="currentColor" />
    <path d="M14 2v4M14 22v4M2 14h4M22 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const VisaoIcon = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <path d="M2 14s4.5-9 12-9 12 9 12 9-4.5 9-12 9-12-9-12-9z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="14" cy="14" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="14" cy="14" r="1.8" fill="currentColor" />
  </svg>
)

const ExcelenciaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
  </svg>
)

const PersonalizacaoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M16 3l2 2-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const EticaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M12 3v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 7h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 7l-2 8c0 1.5 2 3 4.5 3s4.5-1.5 4.5-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M18 7l-2 8c0 1.5-2 3-4.5 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
)

const CompartilhadoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="8" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M2 20c0-3 2.5-5.5 6-5.5 1.2 0 2.3.3 3.2.8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M22 20c0-3-2.5-5.5-6-5.5-1.2 0-2.3.3-3.2.8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
)

const InovacaoPropositoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M10 16v3a2 2 0 004 0v-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 4V2M18 10h2M4 10H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="10" r="2" fill="currentColor" opacity="0.4" />
  </svg>
)

const MercadoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 3c2 3 3 6 3 9s-1 6-3 9M12 3c-2 3-3 6-3 9s1 6 3 9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const AprendizadoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M4 19a2 2 0 012-2h12a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M9 7h6M9 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 15l3-3M12 15l-3-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
  </svg>
)

const KendallIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M7 10h2v4H7zM11 9h2v5h-2zM15 11h2v3h-2z" fill="currentColor" opacity="0.5" />
    <circle cx="12" cy="4" r="1.5" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M12 5.5V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
)

const AIFirstIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 7v2M12 15v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 9.5c0-1 1-2 2.5-2h3c1.5 0 2.5 1 2.5 2s-1 2-2.5 2h-1c-1.5 0-2.5 1-2.5 2s1 2 2.5 2h3c1.5 0 2.5-1 2.5-2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <circle cx="7" cy="12" r="1" fill="currentColor" />
    <circle cx="17" cy="12" r="1" fill="currentColor" />
  </svg>
)

// ─── Mapa Kendall Square ─────────────────────────────────

const NATURAL_EARTH_LAND =
  'M267.6,377.9L252.7,378.3L267.6,377.9ZM46.2,376.7L36.2,374.7L46.2,376.7ZM299.7,373.4L303.7,377.8L279.6,379.2L299.7,373.4ZM130.6,363.3L136.2,363.3L127.5,363.7L130.6,363.3ZM121,363.3L124.4,364.2L117.1,363.2L121,363.3ZM180,359.9L186.2,361.2L172.6,359.8L180,359.9ZM247.9,357.7L242.1,361.1L233.3,359.2L243.9,353.1L247.9,357.7ZM269.7,342.6L254.1,351L262.7,357.1L264.8,363.8L228.4,370.5L236.3,373.1L226.6,376L270.6,384.9L336.6,378.5L320.5,374.1L361.1,366.9L384.7,357.6L460.2,356.6L475.3,352.2L485.9,355.1L521.2,346.3L553.1,351L551,359.7L555.3,360.6L595.5,347.1L612.8,349.7L628.5,345.7L636,348.7L652.5,346.4L666.3,349.5L700.2,345.1L705.5,348.8L723.3,348.7L780.5,359.3L763.5,369.4L771.1,375L759.5,375.9L755.1,379.9L800,388.3L800,400L0,400L2.1,387L82,389L58.7,386L60.3,382.3L51.5,380.2L74.6,378.5L54.8,375.7L48.1,370.9L63.7,372L99.5,365.1L177.5,366.4L169.6,361.4L233.6,364.2L250.3,361.1L249.5,349.6L272.8,341.2L269.7,342.6ZM249.4,319.7L255.4,321.6L246.2,323.3L234.1,317.4L249.4,319.7ZM269.9,313.6L264,315.2L269.9,313.6ZM556.2,310.5L553.2,308.1L556.2,310.5ZM723.1,290.7L729.5,290.8L728.7,296L724.6,296.8L723.1,290.7ZM784.5,290.9L787.2,291.9L784.6,297.5L776.3,303.6L770.4,302.7L784.5,290.9ZM788,280.3L796.7,283.8L789.4,292.6L783.6,276.7L788,280.3ZM771.4,249.2L764.5,244.7L771.4,249.2ZM796.4,238.5L794.2,240.4L796.4,238.5ZM511.2,230.1L504.7,255.4L497.9,255.5L498.8,236L509.3,226.8L511.2,230.1ZM719,230.6L740.3,257.9L739.8,270.3L733.3,283.2L725.2,286.7L712.5,284.5L707.1,276.4L704.1,278.4L706.2,273.1L702.2,277.5L691.8,270L662.3,277.9L655.6,276L653.7,248.3L668.6,243.7L679.3,231.6L688,233.3L694.1,224.7L703.3,226.3L701.1,233.3L711.6,239.4L716.7,223.7L719,230.6ZM668.3,222.8L664.4,221.2L668.3,222.8ZM757.4,221.9L754.9,220.5L757.4,221.9ZM759.3,221.3L756.8,218.5L759.3,221.3ZM676.5,222.5L683,218.7L676.5,222.5ZM662,218L664.7,219.3L659.4,220.1L662,218ZM673.1,218L666.5,219.6L673.1,218ZM755.3,218.5L751.6,216.5L755.3,218.5ZM750.1,216.3L747.9,214.7L750.1,216.3ZM641.4,215.1L657.1,218.6L634.1,215.2L641.4,215.1ZM746.4,215.2L743.4,211.4L746.4,215.2ZM737.7,212.2L729.6,212.8L736.8,209.3L737.7,212.2ZM682.8,207.7L680,207.1L682.8,207.7ZM689.9,206.9L684.2,207.5L689.9,206.9ZM740.3,210L734.8,206.1L740.3,210ZM698.1,202.6L701,207.5L707.4,203.8L721.3,208.6L734.9,223.5L721.7,217L717,220.7L705.8,218.7L706.5,212L695.5,209.1L693.3,206.3L697.1,204.9L690,202.1L698.1,202.6ZM678.3,196.8L667.1,199.5L668.7,203.1L674.1,201.4L670,204.2L673.7,211.9L668.8,205.8L665.3,212L666.7,198.7L678.3,196.8ZM686,197.5L684.7,202L684.3,195.2L686,197.5ZM635.2,213L628,209.4L611.8,187.8L630.8,199.8L635.8,206.8L635.2,213ZM661.9,195.9L664.4,198L658.1,208.9L644.9,206.5L642.4,201L643.7,195.5L659.4,184.6L664.8,188L661.9,195.9ZM680.8,181.3L678.7,187.6L674.7,182.6L670.9,184L678.7,178.3L680.8,181.3ZM580.5,186.2L577.5,185L578.1,178.2L580.5,186.2ZM675.5,177.2L672,178.4L675.5,177.2ZM663.3,179.3L660.4,181.4L665.6,174.7L663.3,179.3ZM670.9,173.6L673.6,174.3L671.1,176.8L670.9,173.6ZM678.9,173L677.3,177.5L676.1,172.1L678.9,173ZM670.1,171L667.4,170.1L670.1,171ZM669.6,158.9L670.5,168.2L675.7,172.1L666.8,166.7L669.6,158.9ZM254.2,159.5L250.6,159.2L254.2,159.5ZM229.1,160.3L225.9,159.5L229.1,160.3ZM238.7,155.8L248.2,158.6L234.5,159.2L238.7,155.8ZM645.2,158.5L641.4,157L646.2,155.4L645.2,158.5ZM54.4,157.6L53.6,155L54.4,157.6ZM222.9,149.4L235.2,154.9L227.2,155.9L218.2,149.7L211.2,151.3L222.9,149.4ZM227.7,147.2L226.2,144L227.7,147.2ZM669.3,149.4L666.9,147.7L670,143.8L669.3,149.4ZM227.1,140.9L224.5,140.5L227.1,140.9ZM699.2,124.1L694.1,126.7L699.2,124.1ZM476.8,120.7L471.7,122L476.8,120.7ZM452.7,120.7L458.4,121.6L452.7,120.7ZM434.5,115L433.6,118.6L427.6,116.4L434.5,115ZM420.5,108.4L419.6,113.5L420.5,108.4ZM713.3,117.5L711.7,121.9L701.8,125.6L691.1,124.7L693.3,126.3L689.3,130.2L687.6,126L701.5,121.1L714.2,108L713.3,117.5ZM719.8,101.8L723.4,103.9L711,107.6L715.5,98.8L719.8,101.8ZM258.5,96.6L262.2,96.8L258.5,96.6ZM262.7,90.9L256.6,89.2L262.7,90.9ZM125.5,92.2L114.8,87.2L125.5,92.2ZM275.3,87.4L281.2,90.6L282.1,96.3L268.3,94.2L276.9,85.4L275.3,87.4ZM105.1,79.9L108.5,84L105.1,79.9ZM719.2,87.2L721.5,91.2L718.2,90.4L718.9,97.5L715.8,97.9L716,79.5L719.2,87.2ZM384.9,83.9L377.8,84.8L378.5,80.3L385,77.4L384.9,83.9ZM428.2,76.4L424.2,76L428.2,76.4ZM60,73.1L56.3,72.3L60,73.1ZM393.3,69.7L393.1,75.6L403.7,82.8L403.2,86L388.3,89L392.4,85.7L388.3,84.5L389.8,81.1L393.5,80L386.3,73.8L393.3,69.7ZM32,66.9L27.9,66.2L32,66.9ZM218,60.6L213.3,61.2L218,60.6ZM18.4,58.3L25.1,59.3L18.4,58.3ZM210.8,54.1L222,58.4L206.2,58.8L210.8,54.1ZM367.8,52.3L369.8,55.3L358.5,58.9L345.9,54.2L367.8,52.3ZM231.4,50.8L228.4,49.8L233.1,48.9L231.4,50.8ZM11.1,52L22.4,53.4L15.7,57.2L2.9,53.1L0,55.6L0,46.7L11.1,52ZM187.4,46.4L178.2,45.8L187.4,46.4ZM800,42.6L797.2,42L800,42.6ZM2.9,42.5L0,41.1L5.4,41.6L2.9,42.5ZM198.8,45.6L205.9,50.7L210,44.7L216.4,45.2L219.4,49.8L193,62.2L189.6,69L194.9,73.1L217.2,77.4L222.4,86.2L225.3,83.2L222.6,78.5L229.9,74.4L225.5,69.3L226.4,61.5L235.9,61.2L245.4,64.3L249.7,70.6L256.5,65.9L276.3,84.1L252.4,88.4L242,96L255.4,90.6L256.7,97.2L267.1,98L254.7,103.2L253,101.2L256.8,99.4L250.8,99.7L242.9,104.4L244.5,107.5L232.2,112.2L231.2,117.3L230.3,113L231.7,121L219.3,130.1L221.4,144L213.1,133.1L185.3,137.1L182.5,150.1L186,157.1L195.5,158.4L206.6,152.1L202.4,164.7L214.6,166.1L213.8,175.3L219,180.5L229.3,180.8L240.5,172.4L240.7,179.8L244.6,173L248.5,176.5L262.5,176.2L273,186.7L286,190.7L288,200.2L311.2,206.4L322.8,216.3L314.1,229L309,248.7L294.1,255.3L280.4,276.4L270.2,275.4L273.8,282L255.3,291.3L259,294.6L250.5,301.2L253.4,307L246.4,312.7L248.6,316.3L242.2,319.6L233.5,316.1L232,308.2L235.3,304.3L231.9,303.7L238.4,294.2L234.8,296.1L244.1,243.9L231.1,232.6L219.4,213.6L222.7,205.9L220.1,202.3L228.6,191.4L226.3,181.5L220.3,184L209.6,177.9L205.6,170.5L170,159.4L144.9,129.3L156.8,148.5L150.7,145L123.6,110.4L122.9,92.9L127.6,95.3L127,91.1L116.8,87L102,70.8L73.1,64.7L62.9,68.5L65.3,63.8L47.9,75.6L33.8,79.1L51,69.1L40.1,69.6L30.8,63.3L42.7,56L26.4,54.1L40.7,53.1L29.4,48.1L52,41.4L96.7,46.9L115.2,43.4L158,50.3L164.1,47.1L186.4,50.5L190.6,46.5L185.6,44.2L188.4,40.2L198.8,45.6ZM146.3,37.5L159.6,40.8L159.1,37.6L163.3,37.6L175.4,45.4L148.2,47.7L139.2,44.5L150.2,43.6L134.7,41L146.3,37.5ZM167.8,36.8L162.4,36.8L167.8,36.8ZM230.4,37.5L220.3,37L230.4,37.5ZM207.6,37.4L239.5,41L251.2,46.3L247.1,47.3L262.6,51.4L258,55.6L248.9,52.7L256.3,59.1L247.1,58.3L253,62.4L227.3,57.3L235.6,54.5L237.9,49.5L224.5,44.1L200.2,41.7L201.3,37.5L207.6,37.4ZM177,35.9L183.6,36.1L185.1,40.8L172.2,38.9L177,35.9ZM719.1,37.3L710.8,37L719.1,37.3ZM192.9,38.3L188,39.9L186.6,36.8L198.9,35.9L192.9,38.3ZM132.3,41.3L120.2,40.3L124.6,36.3L122.4,34.9L143.3,36.7L132.3,41.3ZM735,33.1L724.7,32.9L735,33.1ZM192,33.4L184.8,33.5L192,33.4ZM722.4,32.1L704.4,32.8L722.4,32.1ZM181.1,29.5L181.9,33.3L172.2,32.1L181.1,29.5ZM159.5,30.7L165.1,32.3L138.4,32.8L159.5,30.7ZM527.9,42.8L514.3,40L523.6,33.2L553,29.9L529.9,34.9L523.2,39.2L527.9,42.8ZM189.6,28.7L222.6,33.5L200.5,34.4L184.2,29.4L189.6,28.7ZM141.8,27.5L127,30.9L141.8,27.5ZM637.7,28.9L653.6,31.4L643.1,35.2L682.2,36.5L691.8,42.7L710.8,41.1L712.2,38.1L776.8,47.3L778.8,44.2L790.5,44.7L800,46.7L800,55.6L794.2,56.4L798.3,61.5L763.4,67L760.3,78.1L748.4,86.6L746.5,73.8L765.5,61L755.8,65.5L748.3,63.5L744.5,68.6L716,68.8L700.3,78.4L710.9,79.6L714.2,83.9L707.2,97.1L683.4,111.7L686.9,122L681.1,123.6L678.5,112.1L669,113.6L670.3,109L662.3,112.9L664.2,116.8L671.9,116.8L664.8,122.4L670.9,129.6L670.4,137.3L657.5,149.4L635.3,156.1L643,170.2L633.7,180.9L622.4,170.2L620.5,179.5L628.8,187.7L631.6,197.1L618.5,182.7L615.9,162.4L609.3,164.4L603.1,149.4L593.3,152.2L578.5,164.7L577.5,177L572.3,182.3L561.4,152.5L556.6,153.6L547.5,143.5L527.5,142.8L506.6,133.4L515.1,146.6L525.2,141.3L532.9,150.4L522.8,161.7L496.6,171.9L494.8,162.7L477.6,134.4L475.4,138.6L472.1,133.7L483.3,158.6L494.9,173.9L499.1,176.8L513.6,173.3L513.4,176.4L506.1,190.6L487.1,210.4L490.6,232.6L477.3,244L479.1,252.7L472.4,257.2L471.6,263.9L457.3,275.4L440.8,275.9L426.2,240.2L430.4,223.8L419.6,202.5L420.9,191.7L409.6,186.1L380,189.3L363.1,173L362.3,151.4L386.8,120.5L421.1,117L424.7,118L423,124.9L442.4,132.7L447.9,127L475.1,131.2L480.4,118.6L461.4,118.5L458.2,112.3L474.5,106.6L492.7,106.7L481.5,99.5L486.9,95L477.7,97.2L480.7,99.7L475.3,101.4L468.3,96.5L461.5,105.4L464,108.8L450.3,110.5L453.4,116.3L450,119.1L443.4,107.3L429.2,98.4L428,102L441.1,110.7L437.5,110.1L435.8,115.6L419.8,101.4L406.9,104.3L395.2,118.5L380.2,118.1L379.1,104.4L396.9,102.2L397.3,97.7L389.8,91.8L418,81L419,73.1L423.5,71.7L421.4,76.7L424.3,80L443.7,79.1L448,72.4L453.6,73.3L451.9,68.5L464.7,66.6L447.4,65.1L447.9,59.6L456.4,55.3L449.3,53.9L439.7,60.6L438,63.7L441.8,66.5L435.3,75.3L428.8,77L423,67.8L412.6,69.8L411.1,62.3L432.8,49.3L454.5,42.2L491.2,50.1L485.3,53.3L473.7,51.9L482.3,58.1L482.6,55.2L497.7,53.2L496.6,47.6L502.8,48.3L503,51.8L519.4,47L533.2,48.3L534.6,44.8L552.2,48.7L548.2,42.2L561.3,38.3L563.7,48L558.4,52.6L560.9,52.9L566.8,49.4L562.4,41.2L565.9,38.2L569.7,41.9L581.1,40.6L578.9,36.3L593.7,33.1L637.7,28.9ZM509.1,108.3L512,110.5L509.3,116.5L519.6,117.9L517.1,111L521.6,109L511.8,100.9L517.9,99.4L517.9,95.9L503.7,100.9L509.1,108.3ZM191.5,27.7L185.7,27L191.5,27.7ZM155.1,27.3L147.7,27.3L155.1,27.3ZM454.9,27L446.1,27.4L454.9,27ZM156.3,25.3L149.9,25.8L156.3,25.3ZM187,26.5L180.8,24.7L187,26.5ZM177.6,25.9L165.6,23.8L177.6,25.9ZM633.5,26L621,26.8L626.9,23.7L633.5,26ZM440.6,22.9L447.9,24.5L435.4,29.4L423.2,23L440.6,22.9ZM456.6,21.3L460.9,22.1L438.6,21.5L456.6,21.3ZM513.6,21L499.7,20.9L513.6,21ZM622.1,24.7L602.6,21.5L613.2,19.4L622.1,24.7ZM206.6,23L209.3,23.7L198.2,26.2L185.1,21.9L194.6,19.4L206.6,23ZM247.8,15.3L262.6,16.4L229.1,23.7L232.5,25.5L221,30.7L201.1,30.1L211.2,27.7L204.5,25.8L210.9,23.7L206.8,21.7L218.1,21.2L196.5,18L247.8,15.3ZM339.8,14.4L353.7,16.2L329.1,17.3L372.9,19.4L355.5,21.8L360.6,21.9L356.2,25L358.9,28.9L351.8,29.7L356.9,34.9L344.9,39.3L351.7,43L341.4,43.9L350.3,44.2L311.5,54.5L303.6,66.4L292.7,64.8L285.3,58.6L280.1,50.7L287,44.6L278.5,45.3L285.8,43.2L275.9,40.8L278.4,38.7L269.8,32.2L247.8,31L241.3,28.9L251.6,28.1L237.1,26.6L254,23.6L248.8,22L260.8,18.3L339.8,14.4Z'

// Kendall Square coordinates: lon=-71.0901, lat=42.3629
// Equirectangular projection → viewBox 800×400: cx=242.0, cy=105.9
const KENDALL_CX = 242.0
const KENDALL_CY = 105.9

const KendallMap = () => (
  <svg viewBox="0 0 800 400" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>{`
        @keyframes kendall-radar {
          0% { r: 3; opacity: 0.9; }
          100% { r: 14; opacity: 0; }
        }
      `}</style>
    </defs>
    {/* Natural Earth 110m land — equirectangular projection (EPSG:4326) */}
    <path d={NATURAL_EARTH_LAND} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    {/* Kendall Square / CIC — Cambridge, MA */}
    <circle cx={KENDALL_CX} cy={KENDALL_CY} r="3" fill="none" stroke="rgba(220,60,60,0.9)" strokeWidth="1.5" style={{ animation: 'kendall-radar 2s ease-out infinite' }} />
    <circle cx={KENDALL_CX} cy={KENDALL_CY} r="3" fill="none" stroke="rgba(220,60,60,0.9)" strokeWidth="1.5" style={{ animation: 'kendall-radar 2s ease-out infinite', animationDelay: '0.7s' }} />
    <circle cx={KENDALL_CX} cy={KENDALL_CY} r="3" fill="none" stroke="rgba(220,60,60,0.9)" strokeWidth="1.5" style={{ animation: 'kendall-radar 2s ease-out infinite', animationDelay: '1.4s' }} />
    <circle cx={KENDALL_CX} cy={KENDALL_CY} r="3.5" fill="rgba(220,60,60,1)" />
    {/* Label */}
    <text x={KENDALL_CX + 12} y={KENDALL_CY - 3} fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="Lato, sans-serif" fontWeight="400">Kendall Square</text>
    <text x={KENDALL_CX + 12} y={KENDALL_CY + 8} fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="Lato, sans-serif">Cambridge, MA</text>
  </svg>
)

// ─── Dados dos cartões ──────────────────────────────────

const valores = [
  {
    title: 'Excelência',
    desc: 'Padrões elevados em conteúdo acadêmico e parcerias internacionais.',
    Icon: ExcelenciaIcon,
    gradient: 'linear-gradient(135deg, #1e1e1e, #2a2a2a)',
    modalTitle: 'Excelência',
    modalDesc: 'Nosso compromisso com a excelência se traduz em conteúdos desenvolvidos com rigor acadêmico de instituições como MIT Professional Education e FGV, aliados à vivência prática de executivos que atuam nos maiores mercados do mundo. Cada programa é construído para entregar o mais alto nível de qualidade, com metodologias validadas internacionalmente e resultados mensuráveis para lideranças e organizações.',
  },
  {
    title: 'Personalização',
    desc: 'Experiências de aprendizagem inovadoras e sob medida.',
    Icon: PersonalizacaoIcon,
    gradient: 'linear-gradient(135deg, #222222, #2e2e2e)',
    modalTitle: 'Personalização',
    modalDesc: 'Acreditamos que cada organização possui desafios únicos. Por isso, desenhamos trilhas de aprendizagem sob medida, adaptadas à cultura, ao momento estratégico e aos objetivos de cada cliente. Da análise diagnóstica à entrega final, cada etapa é customizada para maximizar a absorção de conhecimento e a aplicabilidade prática dos conteúdos, gerando transformação real e duradoura.',
  },
  {
    title: 'Consciência Ética',
    desc: 'Relações baseadas em valores éticos e propósito compartilhado.',
    Icon: EticaIcon,
    gradient: 'linear-gradient(135deg, #252525, #323232)',
    modalTitle: 'Consciência Ética',
    modalDesc: 'A ética é o alicerce de tudo o que fazemos. Cultivamos relações de confiança com clientes, parceiros e comunidades, pautadas pela transparência, integridade e responsabilidade social. Nossos programas formam líderes que compreendem que resultados sustentáveis só são possíveis quando construídos sobre uma base ética sólida, respeitando pessoas, sociedade e meio ambiente.',
  },
  {
    title: 'Valor Compartilhado',
    desc: 'Parceiros na formação de líderes responsáveis.',
    Icon: CompartilhadoIcon,
    gradient: 'linear-gradient(135deg, #1c1c1c, #282828)',
    modalTitle: 'Valor Compartilhado',
    modalDesc: 'Operamos na interseção entre geração de valor econômico e impacto social positivo. Nossos programas são projetados para que cada investimento em desenvolvimento de talentos gere retorno tangível para a organização e, simultaneamente, contribua para o fortalecimento das comunidades e da sociedade. Formamos líderes que entendem que prosperidade genuína é sempre compartilhada.',
  },
  {
    title: 'Inovação com Propósito',
    desc: 'Tecnologia e IA para gerar impacto real e sustentável.',
    Icon: InovacaoPropositoIcon,
    gradient: 'linear-gradient(135deg, #202020, #2c2c2c)',
    modalTitle: 'Inovação com Propósito',
    modalDesc: 'A inovação na Arbache não é um fim em si mesma — é um meio para amplificar o impacto humano. Utilizamos inteligência artificial, ciência de dados e metodologias de ponta para criar experiências de aprendizagem mais eficientes, acessíveis e transformadoras. Cada tecnologia implementada serve a um propósito claro: potencializar o desenvolvimento de pessoas e organizações.',
  },
  {
    title: 'Conexão com o Mercado',
    desc: 'Integração com executivos e desafios reais dos negócios.',
    Icon: MercadoIcon,
    gradient: 'linear-gradient(135deg, #242424, #303030)',
    modalTitle: 'Conexão com o Mercado',
    modalDesc: 'Nossos programas são desenvolvidos em parceria direta com executivos e organizações que enfrentam os desafios mais complexos do mercado global. Essa conexão permanente garante que cada conteúdo, caso prático e simulação reflita a realidade contemporânea dos negócios, preparando lideranças para tomar decisões estratégicas com confiança e visão sistêmica.',
  },
  {
    title: 'Aprendizado Contínuo',
    desc: 'Desenvolvimento permanente como base da alta performance.',
    Icon: AprendizadoIcon,
    gradient: 'linear-gradient(135deg, #1e1e1e, #2a2a2a)',
    modalTitle: 'Aprendizado Contínuo',
    modalDesc: 'Em um mundo que se transforma em velocidade exponencial, o aprendizado contínuo é a competência mais estratégica de uma organização. Criamos ecossistemas de desenvolvimento que acompanham líderes e equipes ao longo de toda a jornada profissional, com conteúdos atualizados, mentorias recorrentes e comunidades de prática que mantêm o conhecimento vivo e aplicável.',
  },
  {
    title: 'Conexão com a Inovação',
    desc: 'Conectados às maiores tecnologias produzidas em Kendall Square.',
    Icon: KendallIcon,
    gradient: 'linear-gradient(135deg, #1a1a1e, #262630)',
    modalTitle: 'Conexão com a Inovação',
    modalDesc: 'KENDALL_SQUARE',
  },
  {
    title: 'AI First',
    desc: 'Empresa administrada por IA na busca de precisão e qualidade.',
    Icon: AIFirstIcon,
    gradient: 'linear-gradient(135deg, #1c1c22, #28282e)',
    modalTitle: 'AI First',
    modalDesc: 'Somos uma empresa AI First — a inteligência artificial não é apenas uma ferramenta, é parte estrutural da nossa operação. Da curadoria de conteúdos à análise de dados de performance, da personalização de trilhas de aprendizagem à gestão operacional, a IA permeia cada processo com o objetivo de alcançar máxima precisão, eficiência e qualidade. Essa abordagem nos permite entregar experiências educacionais hiperpersonalizadas, escalar com consistência e antecipar tendências do mercado. Acreditamos que a combinação entre inteligência artificial e inteligência humana é o caminho para resultados extraordinários.',
  },
]

// ─── Close icon ──────────────────────────────────────────

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ─── Modal Component ─────────────────────────────────────

function ValorModal({ valor, onClose }: { valor: typeof valores[number]; onClose: () => void }) {
  const isKendall = valor.modalDesc === 'KENDALL_SQUARE'

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[640px] max-h-[85vh] overflow-y-auto rounded-2xl p-8 md:p-10"
        style={{ background: '#141414', boxShadow: '0 24px 80px rgba(0,0,0,0.8)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Fechar"
        >
          <CloseIcon />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/8 text-[#E6E6E6] border border-white/10">
            <valor.Icon />
          </div>
          <h3 className="font-section text-[1.5rem] text-[#E6E6E6]">{valor.modalTitle}</h3>
        </div>

        {isKendall ? (
          <>
            <p className="text-white/80 text-[0.95rem] leading-relaxed mb-6">
              Mantemos conexão direta com o ecossistema de inovação mais denso do planeta: Kendall Square, em Cambridge, Massachusetts. Este quilômetro quadrado concentra mais inovação por metro quadrado do que qualquer outro lugar do mundo, reunindo as maiores universidades, centros de pesquisa e empresas de tecnologia globais.
            </p>

            {/* Map */}
            <div className="mb-6 rounded-xl overflow-hidden border border-white/10 bg-black/30 p-4">
              <KendallMap />
            </div>

            <div className="mb-6">
              <h4 className="font-[Montserrat] text-[0.7rem] tracking-[0.15em] uppercase text-white/50 mb-4">Universidades</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {['MIT', 'Harvard University', 'Boston University', 'Tufts University'].map((name) => (
                  <span key={name} className="font-[Lato,sans-serif] text-[0.85rem] text-white/80 bg-white/6 px-3 py-1.5 rounded-lg border border-white/10">{name}</span>
                ))}
              </div>

              <h4 className="font-[Montserrat] text-[0.7rem] tracking-[0.15em] uppercase text-white/50 mb-4">Empresas e Centros de Pesquisa</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple',
                  'IBM', 'Moderna', 'Novartis', 'Pfizer', 'Sanofi',
                  'Akamai Technologies', 'Biogen', 'Broad Institute',
                ].map((name) => (
                  <span key={name} className="font-[Lato,sans-serif] text-[0.85rem] text-white/80 bg-white/6 px-3 py-1.5 rounded-lg border border-white/10">{name}</span>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <p className="font-[Lato,sans-serif] text-[0.95rem] text-white/90 font-medium">
                Presença permanente no Cambridge Innovation Center (CIC)
              </p>
              <p className="font-[Lato,sans-serif] text-[0.82rem] text-white/50 mt-1">
                O maior hub de inovação e empreendedorismo do mundo, localizado no coração de Kendall Square.
              </p>
            </div>
          </>
        ) : (
          <p className="text-white/80 text-[0.95rem] leading-relaxed">{valor.modalDesc}</p>
        )}
      </div>
    </div>
  )
}

// ─── Counter ─────────────────────────────────────────────

function Counter({ target, label, isYear = false }: { target: number; label: string; isYear?: boolean }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>()
  const count = useCounterAnimation(target, isVisible)

  const formatNumber = (num: number) => {
    if (isYear) return num.toString()
    if (num >= 1000) return `+${num.toLocaleString('pt-BR')}`
    return `${num}+`
  }

  return (
    <div ref={ref} className="text-center">
      <div className="font-[Cinzel] text-[2.8rem] font-bold text-[#E6E6E6]">
        {isVisible ? formatNumber(count) : '—'}
      </div>
      <div className="font-[Montserrat] text-[0.7rem] tracking-[0.12em] uppercase text-white/60 mt-1">
        {label}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────

export function Proposito() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>()
  const { ref: mvvRef, isVisible: mvvVisible } = useReveal<HTMLDivElement>()
  const { ref: valoresRef, isVisible: valoresVisible } = useReveal<HTMLDivElement>()
  const [activeModal, setActiveModal] = useState<number | null>(null)

  return (
    <section
      id="proposito"
      className="py-[100px] relative overflow-hidden text-white"
      style={{ background: '#141414' }}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
        <div ref={titleRef}>
          <h2
            className={cn(
              'font-section text-[clamp(1.8rem,3.5vw,2.8rem)] mb-4 text-[#E6E6E6] reveal',
              titleVisible && 'visible'
            )}
          >
            Nosso Propósito
          </h2>
          <p
            className={cn(
              'font-tagline text-[1.5rem] text-white/85 max-w-[650px] mx-auto mb-[60px] reveal reveal-delay-1',
              titleVisible && 'visible'
            )}
          >
            &ldquo;Mudar o mundo por meio da educação, transformando conhecimento em resultados!&rdquo;
          </p>
        </div>

        <div
          ref={mvvRef}
          className={cn(
            'grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10 mb-[60px] reveal reveal-delay-2',
            mvvVisible && 'visible'
          )}
        >
          <div
            className="rounded-2xl p-9 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02]"
            style={{
              background: '#1a1a1a',
              boxShadow: '8px 8px 20px rgba(0,0,0,0.6), -8px -8px 20px rgba(255,255,255,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '12px 12px 30px rgba(0,0,0,0.8), -6px -6px 16px rgba(255,255,255,0.06), 0 0 40px rgba(255,255,255,0.03)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '8px 8px 20px rgba(0,0,0,0.6), -8px -8px 20px rgba(255,255,255,0.04)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-[#E6E6E6]"><MissaoIcon /></div>
              <h3 className="font-section text-[1.3rem] text-[#E6E6E6]">Missão</h3>
            </div>
            <p className="text-white/80 text-[0.95rem]">
              Promover educação de excelência e personalizada para negócios, lideranças e talentos,
              integrando rigor acadêmico, práticas de mercado, inovação tecnológica, conexões e
              sustentabilidade, para desenvolver lideranças conscientes e gerar resultados de alto
              desempenho.
            </p>
          </div>
          <div
            className="rounded-2xl p-9 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02]"
            style={{
              background: '#1a1a1a',
              boxShadow: '8px 8px 20px rgba(0,0,0,0.6), -8px -8px 20px rgba(255,255,255,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '12px 12px 30px rgba(0,0,0,0.8), -6px -6px 16px rgba(255,255,255,0.06), 0 0 40px rgba(255,255,255,0.03)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '8px 8px 20px rgba(0,0,0,0.6), -8px -8px 20px rgba(255,255,255,0.04)'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-[#E6E6E6]"><VisaoIcon /></div>
              <h3 className="font-section text-[1.3rem] text-[#E6E6E6]">Visão</h3>
            </div>
            <p className="text-white/80 text-[0.95rem]">
              Ser referência em educação em negócios, reconhecida pela excelência e personalização
              na formação de lideranças e talentos conscientes e inovadores, que geram resultados de
              alto desempenho.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 mb-12">
          <Counter target={4000} label="Líderes Desenvolvidos" />
          <Counter target={20} label="Anos de Docência" />
          <Counter target={11} label="Livros Publicados" />
          <Counter target={2023} label="SDG Pioneer ONU" isYear />
        </div>

        <div
          ref={valoresRef}
          className={cn(
            'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mt-12 reveal reveal-delay-4',
            valoresVisible && 'visible'
          )}
        >
          {valores.map((valor, index) => (
            <div
              key={valor.title}
              onClick={() => setActiveModal(index)}
              className="rounded-xl p-6 border-l-[3px] border-[#555] text-left cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:border-[#888] group"
              style={{
                background: valor.gradient,
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.03)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)'
              }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="text-[#999] group-hover:text-[#E6E6E6] transition-colors">
                  <valor.Icon />
                </div>
                <strong className="text-[#E6E6E6]">{valor.title}</strong>
              </div>
              <p className="text-white/60 text-[0.85rem] leading-relaxed mb-3">{valor.desc}</p>
              <span className="inline-block font-[Montserrat] text-[0.65rem] tracking-[0.1em] uppercase text-white/40 border border-white/15 rounded-[20px] px-3 py-1 group-hover:text-white/70 group-hover:border-white/30 transition-colors">
                Saiba mais
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {activeModal !== null && (
        <ValorModal
          valor={valores[activeModal]}
          onClose={() => setActiveModal(null)}
        />
      )}
    </section>
  )
}
