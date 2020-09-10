/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import GalleryComponent from 'react-photo-gallery'
import FsLightbox from 'fslightbox-react'

function Gallery({ photos, update }) {
  const [viewerIsOpen, setViewerIsOpen] = useState(false)

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
      <GalleryComponent photos={images} onClick={() => setViewerIsOpen(!viewerIsOpen)} />
      <FsLightbox toggler={viewerIsOpen} sources={photos} key={update} />
    </div>
  )
}

export default Gallery
