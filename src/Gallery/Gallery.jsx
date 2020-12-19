/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react'
import GalleryComponent from 'react-photo-gallery'
import FsLightbox from 'fslightbox-react'

function Gallery({ photos, update }) {
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1,
  })

  const toggleLightbox = useCallback((event, { photo, index }) => {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: index !== undefined || index !== null ? index + 1 : 1,
    })
  })

  const images =
    photos?.map(image => {
      return {
        src: image,
        width: 1,
        height: 1,
      }
    }) || []

  return (
    <div>
      <GalleryComponent photos={images} onClick={toggleLightbox} />
      <FsLightbox toggler={lightboxController.toggler} sources={photos} key={update} slide={lightboxController.slide} />
    </div>
  )
}

export default Gallery
