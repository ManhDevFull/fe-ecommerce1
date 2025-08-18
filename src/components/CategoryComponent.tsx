export default function CategoryComponent() {

  const menu = [
    {
      key: 'groceries',
      name: 'Groceries',
      children: []
    },
    {
      key: 'premiumFruits',
      name: 'Premium Fruits',
      children: []
    },
    {
      key: 'home&Kitchen',
      name: 'Home & Kitchen',
      children: []
    },
    {
      key: 'fashion',
      name: 'Fashion',
      children: []
    },
    {
      key: 'electronics',
      name: 'Electronics',
      children: []
    },
    {
      key: 'beauty',
      name: 'Beauty',
      children: []
    },
    {
      key: 'homeImprovement',
      name: 'Home Improvement',
      children: []
    },
    {
      key: 'sports&Toys&Luggape',
      name: 'Sports, Toys & Luggape',
      children: []
    }
  ]
  return (
    <>
      <ul className="min-h-16 max-h-32 p-2 flex flex-wrap w-full justify-evenly items-center border-gray-100 border-b-2">
        {
          menu && menu.map((item, _index) =>
            <ul key={item.key} className="rounded-full flex h-full items-center bg-gray-100 hover:bg-black hover:text-white duration-500" style={{ padding: '10px 23px 10px 30px' }}>
              <span>{item.name}</span>
              <svg style={{ marginLeft: '7px' }} width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.4053 6.375L9.15527 11.625L3.90527 6.375" stroke="currentColor" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ul>
          )
        }

      </ul>
    </>
  )
}