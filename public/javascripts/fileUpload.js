FilePond.registerPlugin(
    FilePondPluginImageResize,
    FilePondPluginImagePreview,
    FilePondPluginFileEncode);

FilePond.create({
    stylePanelAspectRatio: 100/ 50,
    imageResizeTargetWidth : 50,
    imageResizeTargetHeight : 100,
})

FilePond.parse(document.body);