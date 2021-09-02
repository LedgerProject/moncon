import * as React from 'react'
import { Link as RouterLink } from '@material-ui/core';
const Link = ({children, to, ...other}) => {
  const internal = /^\/(?!\/)/.test(to)

  if (internal) {
    return (
      <RouterLink href={to} {...other}>
        {children}
      </RouterLink>
    )
  }

  return (
    <a href={to} {...other}>
      {children}
    </a>
  )
}

export default Link
