import React from 'react'

export default class BookmarksFilter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {tagFilterInput: ''}
    this.handleTagFilterInput = this.handleTagFilterInput.bind(this)
    this.getMatchingTags = this.getMatchingTags.bind(this)
    this.handleSelectTag = this.handleSelectTag.bind(this)
    this.handleRemoveTag = this.handleRemoveTag.bind(this)
  }

  handleSelectTag (tag) {
    return () => {
      this.setState({tagFilterInput: ''})
      this.props.addTag(tag)
    }
  }

  handleRemoveTag (tag) {
    return (event) => {
      if (event.type === 'click' || event.key === ' ') {
        this.props.removeTag(tag)
      }
    }
  }

  handleTagFilterInput (event) {
    this.setState({tagFilterInput: event.target.value})
  }

  getMatchingTags () {
    return this.props.tags.filter(tag =>
      !this.props.selectedTags.has(tag) &&
      tag.toLowerCase().startsWith(this.state.tagFilterInput.toLowerCase())
    )
  }

  render () {
    const {showArchived, toggleShowArchived, selectedTags} = this.props
    return (
      <div>

        <div className='row'>
          <div className='col-xs-12'>
            <form>
              <label className='form-check-inline'>
                <input type='checkbox' className='form-check-input' checked={showArchived} onClick={toggleShowArchived} />
                <span>Show archived</span>
              </label>
            </form>
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-12'>
            {selectedTags.map(tag =>
              <span key={tag} role='button' tabIndex='0' className='btn tag tag-default' style={{marginLeft: '0.4em'}} onClick={this.handleRemoveTag(tag)} onKeyUp={this.handleRemoveTag(tag)}>
                {tag}
              </span>
            )}
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-12'>
            <form className='form-inline'>
              <div className='form-group'>
                <label className='sr-only' htmlFor='tag-filter-input'>Filter by tag</label>
                <div className={'dropdown ' + (this.state.tagFilterInput && this.getMatchingTags().size ? 'open' : '')}>
                  <input type='text' className='form-control' id='tag-filter-input' placeholder='Filter by tag' value={this.state.tagFilterInput} autoComplete='off' onChange={this.handleTagFilterInput} />
                  <div className='dropdown-menu'>
                    {this.getMatchingTags().map(tag =>
                      <button key={tag} type='button' className='dropdown-item' onClick={this.handleSelectTag(tag)}>{tag}</button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
    )
  }
}
