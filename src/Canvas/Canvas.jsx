/* eslint-disable react/prop-types */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react'

import CanvasDraw from 'react-canvas-draw'
import styled from 'styled-components'

import './Canvas.css'

import Button from '../Components/Button'
import Gallery from '../Gallery/Gallery'

class Canvas extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgSrc: props.imgSrc,
      // TODO: Remove test images
      images: [
        'https://images.unsplash.com/photo-1567015847911-c4d5a85fbd7f',
        'https://images.unsplash.com/photo-1504154885805-140ddf83dfa0',
        'https://images.unsplash.com/photo-1573816725531-0dadf0fd0c31',
        'https://images.unsplash.com/photo-1585138960838-02cef2385b0a',
        'https://images.unsplash.com/photo-1547266255-e4fb916d57df',
      ],
      // TODO: Render result into a gallery
      results: [],
      uuid: null,
    }
  }

  uploadImage = async () => {
    const filetype = 'png'
    const base64 = this.exportImageToFile(this.canvas.canvas.drawing, filetype)
    console.log(base64)

    const unsplash = false // Get from state
    const slider = 1 // Get froms state
    const blob = await (await fetch(base64)).blob()
    const formData = new FormData()
    const file = new File([blob], `filename.${filetype}`)
    formData.append('image', file)
    formData.append('scale', slider)
    formData.append('unsplash', unsplash)

    // TODO: Get this url dynamically
    const url = 'http://localhost:5000/upload'
    let response
    try {
      console.log('Uploading an image...')
      response = await fetch(url, { method: 'POST', body: formData })
      response = await response.json()
    } catch (error) {
      console.log(error)
    }
    console.log(response)
    const urlRegex = new RegExp(/(http(s?):)|([/|.|\w|\s])*\.(?:jpg|gif|png)/)
    const images = response?.images?.filter(link => urlRegex.test(link))
    console.log(images)
    if (images) this.setState({ results: images, uuid: response.uuid })
  }

  exportImageToFile = (canvas, filetype = 'png') => {
    // Get a reference to the "drawing" layer of the canvas
    const context = canvas.getContext('2d')

    // cache height and width
    const { width } = canvas
    const { height } = canvas

    // get the current ImageData for the canvas
    const storedImageData = context.getImageData(0, 0, width, height)
    const compositeOperation = context.globalCompositeOperation
    // set to draw behind current content
    context.globalCompositeOperation = 'destination-over'

    // Export the canvas to data URL
    const imageData = canvas.toDataURL(`image/${filetype}`)
    // Clear and restore canvas with original / cached ImageData
    context.clearRect(0, 0, width, height)
    context.putImageData(storedImageData, 0, 0)

    // reset the globalCompositeOperation to what it was
    context.globalCompositeOperation = compositeOperation
    return imageData
  }

  changeImage = async () => {
    const { images } = this.state
    const index = Math.floor(Math.random() * images.length)
    await this.setState({ imgSrc: images[index] })
    await this.clearImage()
    await this.canvas.drawImage()
  }

  clearBackground = async (reset = false) => {
    await this.setState({ imgSrc: '' })
    // TODO: Check if we want to reset everything
    await this.clearImage(reset)
    this.canvas.drawImage()
  }

  clearDrawings = async () => {
    this.canvas.clear()
  }

  clearImage = async (lines = true) => {
    const { canvasWidth: width, canvasHeight: height } = this.canvas.props
    const context = this.canvas.ctx.grid

    // Save drawn lines
    const data = lines ? this.canvas.getSaveData() : null

    context.save()
    // Use the identity matrix while clearing the canvas
    context.setTransform(1, 0, 0, 1, 0, 0)
    await context.clearRect(0, 0, width, height)

    // Restore the transform
    context.restore()

    if (lines) this.canvas.loadSaveData(data, true)
    else this.clearDrawings()
  }

  undo = () => {
    this.canvas.undo()
  }

  render() {
    const { imgSrc, images, results, uuid } = this.state

    return (
      <div>
        <div className="Canvas">
          <Controls>
            <Button name="Upload" onClick={this.uploadImage} />
            <Button name="Set a random background" onClick={this.changeImage} />
            <Button name="Clear background" onClick={this.clearBackground} />
            <Button name="Undo" onClick={this.undo} />
            <Button name="Reset" onClick={() => this.clearBackground(false)} />
            <Button name="Get random images" onClick={() => this.setState({ results: images })} />
          </Controls>
          <StyledCanvas
            {...this.props}
            imgSrc={imgSrc}
            className="CanvasDraw"
            ref={canvasDraw => (this.canvas = canvasDraw)}
            hideGrid
          />
        </div>
        <Gallery className="Gallery" photos={results} key={uuid || Math.floor(Math.random() * 1000)} />
      </div>
    )
  }
}

const Controls = styled.div`
  font-size: 1.5em;
  text-align: left;
  margin: 1em;
  padding: 0.25em 0.25em;
  display: block;
`

const StyledCanvas = styled(CanvasDraw)`
  margin: 1em;
  padding: 0.25em 1em;
  display: block;
`

Canvas.defaultProps = {
  onChange: null,
  loadTimeOffset: 5,
  lazyRadius: 4,
  boxShadow: '0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3)',
  brushRadius: 2,
  brushColor: '#000',
  catenaryColor: '#0a0302',
  gridColor: 'rgba(150,150,150,0.17)',
  hideGrid: false,
  canvasWidth: 1200,
  canvasHeight: 800,
  disabled: false,
  imgSrc: '',
  saveData: null,
  immediateLoading: false,
  hideInterface: false,
}

export default Canvas
