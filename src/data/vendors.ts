import LaptopImg from '@/assets/img/laptop.png'
import SolarImg from '@/assets/img/solar.png'
import FastnetImg from '@/assets/img/fastnet.png'
import ProbookImg from '@/assets/img/probook.png'

export interface Vendor {
  name: string
  desc: string
  price: string
  verified: boolean
  category: 'Computing' | 'Energy' | 'Connectivity'
  image: string
}

export const vendors: Vendor[] = [
  {
    name: 'TechPro Laptops',
    desc: 'Premium laptops and computing solutions for serious work',
    price: '₦650K',
    verified: true,
    category: 'Computing',
    image: LaptopImg,
  },
  {
    name: 'SolarMax Energy',
    desc: 'Advanced solar panel installations and solutions',
    price: '₦450K',
    verified: true,
    category: 'Energy',
    image: SolarImg,
  },
  {
    name: 'FastNet Connectivity',
    desc: 'High-speed ISP and internet connectivity for productivity',
    price: '₦285K',
    verified: true,
    category: 'Connectivity',
    image: FastnetImg,
  },
  {
    name: 'ProBook Systems',
    desc: 'Professional gaming setup and workstation provider',
    price: '₦850K',
    verified: true,
    category: 'Computing',
    image: ProbookImg,
  },
]
