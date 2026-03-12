'use client'

import Image from 'next/image'

type Props={
size?:number
variant?:'navbar'|'hero'
className?:string
priority?:boolean
}

export default function HexastraLogo({
size=26,
variant='navbar',
className='',
priority=false
}:Props){

const src =
variant === 'hero'
? '/logo/hexastra_glow.svg'
: '/logo/hexastra_navbar_thin.svg'

return(

<div
className={`hx-logo-wrap ${className}`}
style={{width:size,height:size}}
>

<Image
src={src}
alt="HexAstra"
width={size}
height={size}
priority={priority}
className="hx-logo-image"
/>

</div>

)

}