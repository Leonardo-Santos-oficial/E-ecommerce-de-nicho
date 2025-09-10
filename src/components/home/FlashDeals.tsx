import { Product } from '../../types/Product'
import ProductsRow from './ProductsRow'
import Countdown from './Countdown'

type Props = { products: Product[]; endsAt: number }

export default function FlashDeals({ products, endsAt }: Props) {
  return (
    <div>
      <div className="mb-3">
        <Countdown endsAt={endsAt} />
      </div>
      <ProductsRow products={products} onAdd={() => {}} />
    </div>
  )
}
