{
  "manifest_version": 2,

  "name": "Bitify!",
  
  "description": "32 Bit Values analyzer / viewer",
  
  "version": "1.0",

  "app": {
    "launch": {
      "local_path": "index.html",
      "container": "panel",
      "width": 680,
      "height": 157
    }
  },
  
  "permissions": [
  ],
  
  "icons": {  "16": "icon.png",
              "48": "icon.png",
              "128": "icon.png" },
  
  "background": {
    "scripts": ["js/background.js"]
  }
}
