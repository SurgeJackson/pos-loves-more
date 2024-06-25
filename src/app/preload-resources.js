'use client'
 
import ReactDOM from 'react-dom'
 
export function PreloadResources() {
  ReactDOM.preload('/api/pos', {as: 'fetch', fetchPriority: 'high'});
  ReactDOM.preload('/api/categories', {as: 'fetch', fetchPriority: 'high'});
  ReactDOM.preload('/api/menu-items', {as: 'fetch', fetchPriority: 'high'});
  ReactDOM.preload('/api/users', {as: 'fetch', fetchPriority: 'high'});

  return null
}