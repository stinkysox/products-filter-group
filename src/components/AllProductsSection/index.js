import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isSuccess: '',
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    searchInput: '',
    categoryId: categoryOptions[0].categoryId,
    rating: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  onFailure = () => {
    this.setState({isSuccess: false})
  }

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    try {
      const {activeOptionId, categoryId, rating, searchInput} = this.state
      const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryId}&title_search=${searchInput}&rating=${rating}`

      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.products.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }))
        this.setState({
          productsList: updatedData,
          isLoading: false,
          isSuccess: true,
        })
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      this.onFailure()
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }
  onCategoryChange = id => {
    this.setState({categoryId: id}, this.getProducts)
  }

  onRatingChange = id => {
    this.setState({rating: id}, this.getProducts)
  }
  onSearchInputChange = value => {
    this.setState({searchInput: value})
  }

  onSearchInputChange = value => {
    this.setState({searchInput: value}, this.getProducts)
  }

  onResetClicked = () => {
    this.setState(
      {
        productsList: [],
        isSuccess: true,
        isLoading: true,
        activeOptionId: sortbyOptions[0].optionId,
        searchInput: '',
        categoryId: categoryOptions[0].categoryId,
        rating: '',
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId, searchInput} = this.state

    const isEmpty = productsList.length === 0
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {isEmpty ? (
            <div>
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
                alt="No products view"
              />
            </div>
          ) : (
            productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))
          )}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailView = () => {
    return (
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
          alt="products failure"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>
          We are having some trouble processing your request. Please try again.
        </p>
      </div>
    )
  }

  // TODO: Add failure view

  render() {
    const {isLoading, categoryId, isSuccess} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          onSearchInputChange={this.onSearchInputChange}
          categoryOptions={categoryOptions}
          onCategoryChange={this.onCategoryChange}
          categoryId={categoryId}
          ratingsList={ratingsList}
          onRatingChange={this.onRatingChange}
          onResetClicked={this.onResetClicked}
        />
        <div>
          {(() => {
            switch (isSuccess) {
              case true:
                return (
                  <div>
                    {isLoading
                      ? this.renderLoader()
                      : this.renderProductsList()}
                  </div>
                )
              case false:
                return <div>{this.renderFailView()}</div>
              default:
                return null
            }
          })()}
        </div>
      </div>
    )
  }
}

export default AllProductsSection
