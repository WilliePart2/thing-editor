
# Display component's callbacks

### _onRenderResize
### onLanguageChanged

### _onDisableByTrigger
called when parent trigger come disabled


## Editor mode callbacks. Wrap code which acces it in to next macros coments: 
```
///#if EDITOR

/// #endif
```

### __EDITOR_onCreate  
called after object created via class-view additng to stage

### __onSelect() { super.__onSelect(); }
### __onUnselect


### __beforeDestroy
chance do destroy content in editor mode. For cases when onRemove is not calling because of init was not called in editor mode

### __beforeSerialization
### __afterSerialization
### __beforeDeserialization
### __afterDeserialization

### __goToPreviewMode
### __exitPreviewMode
should be binded to this
this.__exitPreviewMode = this.__exitPreviewMode.bind(this);

###__onChildSelected




## debugging helper
### ___h
property returns dom's div which will be highlighted in window during code stopped on breakpoint. Useful to determine where scene's elements are loacated on screen.


---

# Editable fields description options:

### type:
 Number, String, Boolean, 'rect', 'data-path', 'callback', 'btn', 'color', 'splitter'

### title:
 readable name

### name:
 object's editable property name
  // begin name with '__' to make field exist in editor only
        such field will not be included in to build.
  // begin name with '___' to make field exist in editor memory only
        such field will not be saved in to any file.

### default:
 defaultValue

### min, max, step:
 optional for Number property

### select:
 array of {name: 'Readable Name', value: 1} objects to select values from.

### disabled:
 function(selectedObject) {
    return true if field is readonly
 }

### notSeriazable:
 true - if not need save it in to data. Useful for editor helpers fierlds.

### important:
 true - if field should be highlighted in editor

### override:
 true - if field with same name already registred in super class, and need to redefine its appearance

### visible:
 function(selected object) {
   retur false if field should be hidden.
 }

### validate:
 function(val) {
   return 'return message if invalid.'
 }

### isValueValid:
 function(val) { // validator fot path selector ('data-path', 'callback')
   return true if value is valid as target for 'data-path'.
 }

### onClick:
 function(selectedObject) {
   click handler for 'btn' property
 }

### noNullCheck:
 true - if numeric value does not need NaN checking

### tip:
 'Tip text'

### afterEdited(o):
  callback called after property edited by user;


# Editor extendedData
## __getNodeExtendData(displayObject)
get extended data. Available in editor only

## extendedData's flags:

### isSelected
### hidePropsEditor
do not show props editor. Object still can be dragged or rotated

### rotatorLocked
dont show rotation drag point

### hidden
hide in scene's tree

### __EDITOR_isPreviewObject
 //(read only) true if object is prefab which currently opened to edit