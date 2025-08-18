import Link from "next/link";
import { FaGooglePlay, FaApple } from "react-icons/fa6";
import { GrLinkNext } from "react-icons/gr";
export default function FooterComponent() {
  const topCategory = [
    {
      key: 'computerLaptop',
      name: 'Computer & Laptop',
      href: '/computer'
    }, {
      key: 'smartPhone',
      name: 'SmartPhone',
      href: '/smartphone'
    }, {
      key: 'headphone',
      name: 'HeadPhone',
      href: '/headphone'
    }, {
      key: 'accessories',
      name: 'Accessories',
      href: '/accessories'
    }, {
      key: 'cameraPhoto',
      name: 'Camera & Photo',
      href: '/camera'
    }, {
      key: 'tvHomes',
      name: 'TV & Homes',
      href: '/tv'
    }
  ]
  const quickLink = [
    {
      key: 'shopProduct',
      name: 'Shop Product',
      href: '/product'
    }, {
      key: 'shopingCart',
      name: 'Shoping Cart',
      href: '/cart'
    }, {
      key: 'Wishlist',
      name: 'Wishlist',
      href: '/wishlist'
    }, {
      key: 'compare',
      name: 'Compare',
      href: '/compare'
    }, {
      key: 'trackOrder',
      name: 'Track Order',
      href: ',order'
    }, {
      key: 'customerHelp',
      name: 'Customer Help',
      href: '/help'
    }, {
      key: 'aboutUs',
      name: 'About Us',
      href: '/About-Us'
    }
  ]
  const listTag = [
    {
      key: 'game',
      name: 'Game',
      href: '/game'
    }, {
      key: 'iPhone',
      name: 'iPhone',
      href: '/iPhone'
    }, {
      key: 'tv',
      name: 'TV',
      href: '/tv'
    }, {
      key: 'asusLaptops',
      name: 'Asus Laptops',
      href: '/asus-laptop'
    }, {
      key: 'macbook',
      name: 'Macbook',
      href: '/macbook'
    }, {
      key: 'ssd',
      name: 'SSD',
      href: '/ssd'
    }, {
      key: 'graphicsCard',
      name: 'Graphics Card',
      href: '/graphics-card'
    }, {
      key: 'powerBank',
      name: 'Power Bank',
      href: '/power-bank'
    }, {
      key: 'smartTV',
      name: 'Smart TV',
      href: '/smart-tv'
    }, {
      key: 'speaker',
      name: 'Speaker',
      href: '/speaker'
    }, {
      key: 'tablet',
      name: 'Tablet',
      href: '/tablet'
    }, {
      key: 'microwave',
      name: 'Microwave',
      href: '/microwave'
    }, {
      key: 'samsung',
      name: 'Samsung',
      href: '/samsung'
    },
  ]
  return (
    <footer className="w-full flex bg-gray-900 h-96 mt-3 text-white justify-evenly" style={{ padding: '70px 225px' }}>
      <div>
        <h2 className="flex">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M36 18C36 27.9411 27.9411 36 18 36C8.05887 36 0 27.9411 0 18C0 8.05887 8.05887 0 18 0C27.9411 0 36 8.05887 36 18ZM27 18C27 22.9706 22.9706 27 18 27C13.0294 27 9 22.9706 9 18C9 13.0294 13.0294 9 18 9C22.9706 9 27 13.0294 27 18ZM18 24C21.3137 24 24 21.3137 24 18C24 14.6863 21.3137 12 18 12C14.6863 12 12 14.6863 12 18C12 21.3137 14.6863 24 18 24Z" fill="#FA8232" />
          </svg>
          <p style={{ paddingLeft: '7px' }} className="font-extrabold">UNITED DEAL</p>
        </h2>
      </div>
      <div>
        <h6>TOP CATEGORY</h6>
        <ul style={{ margin: '0 !important', padding: '0 !important' }}>
          {topCategory.map((item, _index) =>
            <li key={item.key} className="pt-2"><Link className="w-full h-full ctgr" href={item.href}>{item.name}</Link></li>
          )}
          <li className="pt-2"><Link style={{ color: '#F59E0B' }} className="flex items-center" href={''}><p>Browse All Product </p><GrLinkNext /></Link></li>
        </ul>
      </div>
      <div>
        <h6>QUICK LINK</h6>

        <ul style={{ margin: '0 !important', padding: '0 !important' }}>
          {quickLink.map((item, _index) =>
            <li key={item.key} className="pt-2"><Link href={item.href}>{item.name}</Link></li>
          )}
          <li className="pt-2"><Link href={''}></Link></li>
        </ul>
      </div>
      <div>
        <h6>DOWNLOAD APP</h6>
        <ul className="mt-3" style={{ padding: '0 !important' }}>
          <li className="h-14 w-40 bg-gray-800 flex items-center justify-center rounded-sm" style={{ paddingLeft: '7px' }}>
            <Link href={''} className="w-full h-full flex items-center">
              <FaGooglePlay size={40} />
              <div style={{ marginLeft: '5px' }}>
                <p style={{ fontSize: '13px' }}>Get it now</p>
                <h6 className="text-white">Google Play</h6>
              </div>
            </Link>
          </li>
          <li className="mt-3 h-14 w-40 bg-gray-800 flex items-center justify-center rounded-sm" style={{ paddingLeft: '7px' }}>
            <Link href={''} className="w-full h-full flex items-center">
              <FaApple size={40} />
              <div style={{ marginLeft: '5px' }}>
                <p style={{ fontSize: '13px' }}>Get it now</p>
                <h6 className="text-white">App Store</h6>
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h6>POPULAR TAG</h6>
        <ul style={{paddingLeft: '0 !important'}} className="w-56 flex flex-wrap">
          {
            listTag.map((item, _index) => <Link key={item.key} href={item.href} className="py-1 px-2 mt-1 w-auto hover:bg-gray-700 tag-a duration-400" style={{marginRight: '5px', borderRadius:'2px'}}>
              {item.name}
            </Link>)
          }
        </ul>

      </div>
    </footer>
  )
}