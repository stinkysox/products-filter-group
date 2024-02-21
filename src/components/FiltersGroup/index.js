import './index.css'

const FiltersGroup = props => {
  const {
    onSearchInputChange,
    categoryOptions,
    onCategoryChange,
    ratingsList,
    onRatingChange,
    onResetClicked,
  } = props

  const onChangeSearch = event => {
    onSearchInputChange(event.target.value)
  }

  const onClickCategoryBtn = categoryId => {
    onCategoryChange(categoryId)
  }

  const handleRating = ratingId => {
    onRatingChange(ratingId)
  }

  const handleClear = () => {
    onResetClicked()
  }
  return (
    <div className="filters-group-container">
      <input
        type="search"
        onChange={onChangeSearch}
        className="search-element"
        placeholder="Search"
      />
      <div className="categotry-selection-container">
        <h1>Category</h1>
        {categoryOptions.map(eachItem => (
          <button
            key={eachItem.categoryId}
            className="cat-btn"
            onClick={() => onClickCategoryBtn(eachItem.categoryId)}
          >
            <p>{eachItem.name}</p>
          </button>
        ))}
      </div>
      <div className="categotry-selection-container">
        <h1>Rating</h1>
        {ratingsList.map(eachItem => (
          <button
            key={eachItem.ratingId}
            className="cat-btn"
            onClick={() => handleRating(eachItem.ratingId)}
          >
            <img
              src={eachItem.imageUrl}
              className="rating-image"
              alt={`rating ${eachItem.ratingId}`}
            />
          </button>
        ))}
        <button className="clear-btn" onClick={handleClear}>
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default FiltersGroup
