//-------------code for foo_uie_wsh_mod v1.4.3 or higher ------------------
// ==PREPROCESSOR==
// @name "WSH Cover Panel Mod"
// @version "1.12"
// @author "tomato111"
// @feature "dragdrop"
// ==/PREPROCESSOR==
//-------------Original Code by Jensen (http://dreamxis.themex.net/category/skin-ui/foobar) -------------------
//-------------Mod by tomato111 --------------------------------------

function RGBA(r, g, b, a) {
    var res = 0xff000000 | (r << 16) | (g << 8) | (b);
    if (a != undefined) res = (res & 0x00ffffff) | (a << 24);
    return res;
}

//====================================================
// Properties Object =======================================
/* All settings store here */
var Properties = new function () {
    this.Panel = {
        // 0: Never, 1: When not playing, 2: Always.
        FollowCursor: window.GetProperty("Panel.FollowCursor", 1),
        // Where the images folders in.
        WorkDirectory: window.GetProperty("Panel.WorkDirectory", "import\\EIKO\\"),
        // "ja": Japanese, "en": English, default is LANG in user environment variable.
        lang: window.GetProperty("Panel.Language", "").toLowerCase(),
        // Path external image viewer.
        ExternalViewer: window.GetProperty("Panel.ExternalViewer", ""),
        // Separate with comma, like "255,255,255"
        BackGroundColor: window.GetProperty("Panel.BackGroundColor", ""),
        // Create button's tooltip
        Tooltip: window.CreateTooltip(),
        // Always show "Configure..." on Mainmenu
        ShowConfigureMenu: window.GetProperty("Panel.ShowConfigureMenu", true),
        // Action on click left button, +Shift ,+Ctrl
        LeftButtonClick: window.GetProperty("Panel.LeftButtonClick", "0,0,0"),
        // Action on double click left button
        LeftButtonDoubleClick: window.GetProperty("Panel.LeftButtonDoubleClick", "0,0,0"),
        // Action on click middle button  
        MiddleButtonClick: window.GetProperty("Panel.MiddleButtonClick", "1,0,0"),
        // Backgroud Image Path  
        BackgroundImg: window.GetProperty("Panel.BackgroundImage", ""),
        // Backgroud Image Option. "rotation, opacity"
        BackgroundImgOption: window.GetProperty("Panel.BackgroundImgOption", "0,0,ww,wh,0,255,0"),
        // fb.RunMainMenuCommand
        RunCommand: window.GetProperty("Panel.RunCommand", ""),
        // fb.RunContextMenuCommand
        RunContextCommand: window.GetProperty("Panel.RunContextCommand", ""),
        // Drag Drop option to parse dropped items as playlist. TitleFormatting is abalable. Empty means to be named automaticly by drop.
        DragDropPlaylistName: window.GetProperty("_DragDropPlaylistName", "Dropped Items"),
        DragDropToSelect: window.GetProperty("_DragDropToSelect", false)
    };

    if (typeof (this.Panel.FollowCursor) != "number")
        this.Panel.FollowCursor = 1;
    else if (this.Panel.FollowCursor < 0)
        this.Panel.FollowCursor = 0;
    else if (this.Panel.FollowCursor > 2)
        this.Panel.FollowCursor = 2;

    try {
        this.Panel.FSO = new ActiveXObject("Scripting.FileSystemObject");
    } catch (e) {
        // Impossible to work without FSO.
        fb.ShowPopupMessage(this.Panel.lang == "ja" ? "FileSystemObject が作成出来ないため, WSH Cover Panel Mod は使用できません." : "Can not create File System Object (FSO), WSH Cover Panel Mod can't work.", "WSH Cover Panel Mod", 1);
        new ActiveXObject("Scripting.FileSystemObject"); 	// End scripts running.
    }

    if (!this.Panel.FSO.FolderExists(this.Panel.WorkDirectory))
        window.SetProperty("Panel.WorkDirectory", this.Panel.WorkDirectory = "import\\EIKO\\");

    if (!this.Panel.lang || this.Panel.lang != "ja" && this.Panel.lang != "en") {
        this.Panel.WshShell = new ActiveXObject("WScript.Shell");
        var EnvLang = this.Panel.WshShell.Environment("USER").Item("LANG").substring(0, 2);
        if (EnvLang != "ja" && EnvLang != "en") {
            EnvLang = prompt("Please input menu language.\n" + "\"en\" or \"ja\"", "WSH Cover Panel Mod", "en");
            if (EnvLang != "ja" && EnvLang != "en")
                EnvLang = "en";
        }
        window.SetProperty("Panel.Language", this.Panel.lang = EnvLang);
    }

    if (this.Panel.BackGroundColor) {
        this.Panel.BackGroundColor = this.Panel.BackGroundColor.replace(/ |	/g, "");
        this.Panel.BackGroundColor = this.Panel.BackGroundColor.split(",");
        for (var i in this.Panel.BackGroundColor) {
            if (this.Panel.BackGroundColor[i] < 0)
                this.Panel.BackGroundColor[i] = 0;
            else if (this.Panel.BackGroundColor[i] > 255)
                this.Panel.BackGroundColor[i] = 255;
        }
        if (this.Panel.BackGroundColor.length < 4)
            this.Panel.BackGroundColor.length = 4;
    }

    if (!this.Panel.LeftButtonClick || !value_boolean(this.Panel.LeftButtonClick))
        window.SetProperty("Panel.LeftButtonClick", this.Panel.LeftButtonClick = "0,0,0");
    if (!this.Panel.LeftButtonDoubleClick || !value_boolean(this.Panel.LeftButtonDoubleClick))
        window.SetProperty("Panel.LeftButtonDoubleClick", this.Panel.LeftButtonDoubleClick = "0,0,0");
    if (!this.Panel.MiddleButtonClick || !value_boolean(this.Panel.MiddleButtonClick))
        window.SetProperty("Panel.MiddleButtonClick", this.Panel.MiddleButtonClick = "1,0,0");
    if (!this.Panel.BackgroundImgOption)
        window.SetProperty("Panel.BackgroundImgOption", this.Panel.BackgroundImgOption = "0,0,ww,wh,0,255,0");

    //---------------------------------------------------------------------
    this.Cycle = {
        // Enable image cycle.
        Enable: window.GetProperty("Cycle.Enable", true),
        // Interval period.
        Period: window.GetProperty("Cycle.Period", 10000),
        // Cycle all the wildcard match files in image SourceFormat.
        CycleInWildCard: window.GetProperty("Cycle.CycleInWildCard", true),
        // Pause images cycle automatic when following cursor.
        AutoPauseWhenFollowCursor: window.GetProperty("Cycle.AutoPauseWhenFollowCursor", true),
        // Animations on image's changing. Not only in image cycle, but also in track switching.
        Animation: {
            Enable: window.GetProperty("Cycle.Animation.Enable", true),
            RefreshInterval: window.GetProperty("Cycle.Animation.RefreshInterval", 50),
            Duration: window.GetProperty("Cycle.Animation.Duration", 400)
        },
        // Shuffle Cycle on and after
        Shuffle: window.GetProperty("Cycle.Shuffle", "0")
    };

    if (typeof (this.Cycle.Period) != "number")
        this.Cycle.Period = 7000;
    else if (this.Cycle.Period < 100)
        this.Cycle.Period = 100;

    if (typeof (this.Cycle.Animation.RefreshInterval) != "number")
        this.Cycle.Animation.RefreshInterval = 50;
    else if (this.Cycle.Animation.RefreshInterval < 10)
        this.Cycle.Animation.RefreshInterval = 10;

    if (typeof (this.Cycle.Animation.Duration) != "number")
        this.Cycle.Animation.Duration = 300;
    else if (this.Cycle.Animation.Duration < 10)
        this.Cycle.Animation.Duration = 10;

    if (!this.Cycle.Shuffle)
        window.SetProperty("Cycle.Shuffle", this.Cycle.Shuffle = "0");

    //---------------------------------------------------------------------
    this.Image = {
        // Separate paths by "||"; use "|||" to separate default images and other images, only can be used once; "<embed>" means embed cover, must be a individual path in sourceformat.
        SourceFormat: window.GetProperty("Image.SourceFormat", "<front>||<back>||$directory_path(%path%)\\*.*"),
        // In same group, if SourceFormat not changed, panel will not check any new files, and the images cycle will not be reset.
        GroupFormat: window.GetProperty("Image.GroupFormat", "%album%"),
        // Default image path.
        DefaultImagePath: window.GetProperty("Image.DefaultImagePath", ""),
        //this.Panel.WorkDirectory + "nocover.png
        // File larger than this value will not be loaded. <=0 means no limit.
        MaxFileSize: window.GetProperty("Image.MaxFileSize", 5242880),
        // Keep images aspect ratio.
        KeepAspectRatio: window.GetProperty("Image.KeepAspectRatio", true),
        // Stretch images to fit panel.
        Stretch: window.GetProperty("Image.Stretch", false),
        // Images is stored after resize, so you can set this value larger if your panel size is not very large.
        ImageCacheCapacity: window.GetProperty("Image.ImageCacheCapacity", 10),
        // This panel also stores path search result, only stores the strings.
        PathCacheCapacity: window.GetProperty("Image.PathCacheCapacity", 20),
        // Only these types of files can be displayed. Not necessary to modify this at most times.
        SupportTypes: new Array("jpg", "jpeg", "png", "gif", "bmp"),
        // Image smoothing mode.
        SmoothingMode: window.GetProperty("Image.SmoothingMode", 2),
        // Image interpolation mode in resizing.
        InterpolationMode: window.GetProperty("Image.InterpolationMode", 7),
        // Margin between Panel and Image.
        AdjustMargin: window.GetProperty("Image.AdjustMargin", "6,6,6,6"),
        // Open substituted path when put "View With External Viewer" and <embed>.
        EmbedImageSubstitutedPath: window.GetProperty("Image.EmbedImageSubstitutedPath", "")
    };

    //---------------------------------------------------------------------
    this.Text = {
        FilePath: window.GetProperty("Text.FilePath", "$directory_path(%path%)\\info.txt")
    };
        
    //---------------------------------------------------------------------
    this.Case = {
        // Enable case image.
        ActiveCaseMode: window.GetProperty("Case.ActiveCaseMode", false),
        // Relative value. Separate with comma, like "5,5,5,5". (left,up,right,down)
        AdjustCaseSize: window.GetProperty("Case.AdjustCaseSize", "0,0,0,0"),
        // Put size of case in a panel.
        AdjustCaseSizeInsidePanel: window.GetProperty("Case.AdjustCaseSizeInsidePanel", false),
        // Path "case.png". Default is "[workdirectly]\case.png".
        CaseImagePath: window.GetProperty("Case.CaseImagePath", ""),
        // Enable absolute size mode.
        fixSizeMode: window.GetProperty("Case.fixSizeMode", false),
        // Absolute value. Separate with comma, like "0,0,200,150". (x,y,w,h)
        fixSizeValue: window.GetProperty("Case.fixSizeValue", "0,0,ww,wh"),
        // rot,opacity
        ImageOption: window.GetProperty("Case.ImageOption", "0,255")
    };

    //---------------------------------------------------------------------
    if (!this.Case.AdjustCaseSize)
        window.SetProperty("Case.AdjustCaseSize", this.Case.AdjustCaseSize = "0,0,0,0");
    if (!this.Image.AdjustMargin)
        window.SetProperty("Image.AdjustMargin", this.Image.AdjustMargin = "6,6,6,6");
    if (!this.Case.fixSizeValue)
        window.SetProperty("Case.fixSizeValue", this.Case.fixSizeValue = "0,0,ww,wh");
    if (!this.Case.ImageOption)
        window.SetProperty("Case.ImageOption", this.Case.ImageOption = "0,255");

    if (typeof (this.Image.MaxFileSize) != "number")
        this.Image.MaxFileSize = 5242880;
    else if (this.Image.MaxFileSize < 0)
        this.Image.MaxFileSize = 0;

    if (typeof (this.Image.ImageCacheCapacity) != "number")
        this.Image.ImageCacheCapacity = 10;
    else if (this.Image.ImageCacheCapacity < 0)
        this.Image.ImageCacheCapacity = 0;

    if (typeof (this.Image.PathCacheCapacity) != "number")
        this.Image.PathCacheCapacity = 20;
    else if (this.Image.PathCacheCapacity < 0)
        this.Image.PathCacheCapacity = 0;

    if (typeof (this.Image.SmoothingMode) != "number")
        this.Image.SmoothingMode = 2;
    else if (this.Image.SmoothingMode < -1)
        this.Image.SmoothingMode = -1;
    else if (this.Image.SmoothingMode > 4)
        this.Image.SmoothingMode = 4;

    if (typeof (this.Image.InterpolationMode) != "number")
        this.Image.InterpolationMode = 7;
    else if (this.Image.InterpolationMode < -1)
        this.Image.InterpolationMode = -1;
    else if (this.Image.InterpolationMode > 7)
        this.Image.InterpolationMode = 7;

    //---------------------------------------------------------------------
    this.Buttons = {
        // Whether display the control buttons.
        Display: window.GetProperty("Buttons.Display", true),
        // 0: topleft, 1: topmiddle,  2: topright, 3: bottomleft, 4: bottommiddle, 5: bottomright
        Position: window.GetProperty("Buttons.Position", 4)
    };

    if (typeof (this.Buttons.Position) != "number")
        this.Buttons.Position = 4;
    else if (this.Buttons.Position < 0)
        this.Buttons.Position = 0;
    else if (this.Buttons.Position > 5)
        this.Buttons.Position = 5;

}();
// Prototype =============================================
Array.prototype.shuffle = function (from) { // 配列番号from以降をシャッフルする
    var i = this.length;
    if (i - from < 2) return;
    while (i - from) {
        var j = Math.floor(Math.random() * (i - from)) + Number(from);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}

// Global ================================================
var dragbgcolor = RGBA(193, 219, 252);
var dragging = false;
var DeleteReservedPath = null, DeleteTimer = null;
if (!Properties.Image.DefaultImagePath)
    var DefaultImgPath = Properties.Panel.WorkDirectory + "nocover.png";

var SupportTypes = Properties.Image.SupportTypes;
var IsGFilePropOK = function (file) {
    var ext = Properties.Panel.FSO.GetExtensionName(file).toLowerCase();
    for (var i = 0; i < SupportTypes.length; i++) {
        if (ext == SupportTypes[i])
            return true;
    }
    return false;
};
var BackProp = IsGFilePropOK(Properties.Panel.BackgroundImg);
if (BackProp) {
    var BackgroundImg = gdi.Image(Properties.Panel.BackgroundImg);
    var BackOption = Properties.Panel.BackgroundImgOption.split(",");
    wwwh(BackOption);
    if (BackOption[6] == 1) {
        BackOption[3] = Math.ceil(BackOption[2] * BackgroundImg.height / BackgroundImg.width);
        window.SetProperty("Panel.BackgroundImgOption", Properties.Panel.BackgroundImgOption = BackOption.join());
    }
}

function wwwh(wh) {
    for (var i = 2; i < 4; i++) {
        if (wh[i] == "ww") wh[i] = window.width;
        else if (wh[i] == "wh") wh[i] = window.height;
    }
}

function prompt(text, title, defaultText) {
    var sc = new ActiveXObject("ScriptControl");
    var code = 'Function fn(text, title, defaultText)\n'
    + 'fn = InputBox(text, title, defaultText)\n'
    + 'End Function'
    sc.Language = "VBScript";
    sc.AddCode(code);
    return sc.Run("fn", text, title, defaultText);
}

function value_boolean(s) {
    var bool = true;
    var arr = s.split(",");
    for (var i in arr)
        if (arr.length < 3 || arr[i].match(/\D/) || arr[i] < 0 || arr[i] > 21) {
            bool = false;
            break;
        }
    return bool;
}

//=====================================================
// Three funtions ==========================================

//---------------------------------------------------------------------------------------------
/* Calculate image's new size and offsets in new width and height range. 
Use panel's default settings of stretch and ratio if they are not specified */
function CalcNewImgSize(img, dstW, dstH, srcW, srcH, strch, kar) {
    if (!img) return;
    if (!srcW) srcW = img.width;
    if (!srcH) srcH = img.height;
    if (strch == undefined) strch = Properties.Image.Stretch;
    if (kar == undefined) kar = Properties.Image.KeepAspectRatio;

    var size;
    if (strch) {
        size = { x: 0, y: 0, width: dstW, height: dstH };
        if (kar) {
            size.width = Math.ceil(srcW * dstH / srcH);
            if (size.width > dstW) {
                size.width = dstW;
                size.height = Math.ceil(srcH * dstW / srcW);
            }
        }
    } else {
        size = { x: 0, y: 0, width: srcW, height: srcH };
        if (kar) {
            if (srcH > dstH) {
                size.height = dstH;
                size.width = Math.ceil(srcW * dstH / srcH);
            }
            if (size.width > dstW) {
                size.width = dstW;
                size.height = Math.ceil(srcH * dstW / srcW);
            }
        } else {
            size.width = Math.min(srcW, dstW);
            size.height = Math.min(srcH, dstH);
        }
    }
    size.x = Math.floor((dstW - size.width) / 2);
    size.y = Math.floor((dstH - size.height) / 2);
    return size;
}

//---------------------------------------------------------------------------------------------
/* Reisze image to new width and height */
function ResizeImg(img, dstW, dstH) {
    if (!img || !dstW || !dstH) return img;
    if (img.width == dstW && img.height == dstH) return img;

    var newimg = gdi.CreateImage(dstW, dstH);
    var g = newimg.GetGraphics();
    g.SetSmoothingMode(Properties.Image.SmoothingMode);
    g.SetInterpolationMode(Properties.Image.InterpolationMode);
    g.DrawImage(img, 0, 0, dstW, dstH, 0, 0, img.width, img.height);
    newimg.ReleaseGraphics(g);
    CollectGarbage(); 		// Release memory.
    return newimg;
}

//---------------------------------------------------------------------------------------------
/* Remove an element from "this" array, return the removed element */
function RemoveFromArray(index) {
    if (index == 0)
        return this.shift();
    else if (index == this.length - 1)
        return this.pop();
    var c = this[index];
    var rest = this.slice(index + 1);
    this.length = index;
    this.push.apply(this, rest);
    return c;
}


//====================================================
// Define Image Loader ====================================
/* Loader image file from specified path. It contains a image cache.
Primarily provides the "GetImg()" method */
var ImageLoader = new function (Prop) {
    var ImgCacheCapacity = Prop.Image.ImageCacheCapacity;

    if (ImgCacheCapacity) {
        // Cache array is always sorted, sort by last accessed.
        // Array's length never change.
        // No empty element, only empty "cacheitem".
        // No item will really be deleted, only be deassigned.
        var ImgsCache = new Array;
        // Admissible size error in cache reading.
        ImgsCache.ImgSizeError1 = 10; 	// For enlarge.
        ImgsCache.ImgSizeError2 = 50; 	// For shrink.

        // Class of the items in cache.
        ImgsCache.cacheItem = function (path, imgobj) {
            this.Path = path; 		// String.
            this.ImgObj = imgobj; 		// Object, gdi.Image() object, or empty.
            this.srcW = 0; 		// Source width.
            this.srcH = 0; 		// Source height
        };

        // Fill the cache array with empty cacheitems.
        for (var i = 0; i < ImgCacheCapacity - 1; i++)
            ImgsCache.push(new ImgsCache.cacheItem(null, null));

        // Remove element from cache array, return the removed element.
        ImgsCache.remove = RemoveFromArray;

        // Store item in the beginning of the cache array. Duplicate item's "ImgObj" will be overwritten.
        ImgsCache.Store = function (path, imgobj, srcW, srcH) {
            var c;
            if (this.SearchFor(path)) {
                c = this[0]; 		// This is the one just found.
                c.ImgObj = imgobj;
                if (srcW) c.srcW = srcW;
                if (srcH) c.srcH = srcH;
            } else if (c = this.pop()) {
                c.Path = path;
                c.ImgObj = imgobj;
                c.srcW = srcW ? srcW : (imgobj ? imgobj.width : 0); 		// Store source width.
                c.srcH = srcH ? srcH : (imgobj ? imgobj.height : 0); 		// Store source height.
                this.unshift(c);
            }
        };

        // Search in cache, find the image object.
        // Resize "ImgObj" to "dst" size, if current size is not enough, and the source size is closer, remove this item and return nothing.
        // Or, move it to the beginning of the cache array, then resize image, then return this cache item.
        // If no result found, return nothing.
        ImgsCache.SearchFor = function (path, dstW, dstH) {
            var i = 0;
            for (i; i < this.length; i++)			// Find it.
                if (this[i].Path == path)
                    break;

            if (i < this.length) {
                var c = this.remove(i);
                var img = c.ImgObj;
                // For resizing------------------------
                if (img && dstW && dstH) {
                    var size = CalcNewImgSize(img, dstW, dstH, c.srcW, c.srcH);
                    // If image should be enlarged and it still can be enlarged...
                    if ((size.width > img.width && img.width < c.srcW) || (size.height > img.height && img.height < c.srcH)) {
                        // If the dst size is not too large...
                        if (size.width - img.width < this.ImgSizeError1 && size.width < c.srcW && size.height - img.height < this.ImgSizeError1 && size.height < c.srcH)
                            img = ResizeImg(img, size.width, size.height); 	// Only resize, no cache.
                        else {
                            // Return to reload image file.
                            this.push(c);
                            return;
                        }
                        // If it's shrinking...
                    } else if (size.width < img.width || size.height < img.height) {
                        // If the dst size is too small...
                        if (img.width - size.width > this.ImgSizeError2 || img.height - size.height > this.ImgSizeError2) {
                            img = ResizeImg(img, size.width, size.height); 	// Resize and cache.
                            c.ImgObj = img;
                        } else
                            img = ResizeImg(img, size.width, size.height); 	// Resize and don't cache.
                    } else {
                        size = CalcNewImgSize(img, dstW, dstH);
                        img = ResizeImg(img, size.width, size.height);
                        c.ImgObj = img;
                    }
                }
                //------------------------------------
                this.unshift(c);
                return (img || true); 	// If path was found, return something "true" at all times.
            }
        };

        // Clear cache, only reset all cache items indeed.
        ImgsCache.Clear = function () {
            for (var i = 0; i < this.length - 1; i++) {
                this[i].Path = null;
                this[i].ImgObj = null;
                this[i].srcW = 0;
                this[i].srcH = 0;
            }
        };
    }

    // Load image file from specified path, generate gdi.Image() object, resize it, cache it, then return it.
    // If path invalid or file corrupt, return nothing.
    this.GetImg = function (path, dstW, dstH, NoCache) {
        if (!path) return;
        var ArtId = ["front", "back", "disc", "icon", "artist", ""];
        var ArtIdRE = [/front>$/, /back>$/, /disc>$/, /icon>$/, /artist>$/];
        var imgobj;
        if (!NoCache && ImgsCache)
            imgobj = ImgsCache.SearchFor(path, dstW, dstH);

        if (imgobj) {
            if (typeof (imgobj) != "object") imgobj = null; 	// Maybe it's a boolean value.
        } else {
            if (path.charAt(0) == "<") {		// Embed image.
                for (var i = 0; i < 5; i++)
                    if (ArtIdRE[i].test(path))
                        break;
                imgobj = utils.GetAlbumArtEmbedded(path.substring(1, path.length - 1 - ArtId[i].length), i === 5 ? 0 : i);
            }
            else
                imgobj = gdi.Image(path);

            var srcW, srcH;
            if (imgobj) {
                srcW = imgobj.width;
                srcH = imgobj.height;
                if (dstW && dstH) {
                    var size = CalcNewImgSize(imgobj, dstW, dstH);
                    imgobj = ResizeImg(imgobj, size.width, size.height);
                }
            }
            // Store every path, even no valid image exists.
            ImgsCache && ImgsCache.Store(path, imgobj, srcW, srcH);
        }

        if (imgobj)
            return imgobj;
    };

    this.ClearCache = function () {
        ImgsCache && ImgsCache.Clear();
    };

}(Properties);

var GetImg = ImageLoader.GetImg;


//====================================================
// Define Path Checker =====================================
/* Find matches image files in directorys. It contains a paths cache.
Primarily provides the "GetImgPaths()" method */
var PathChecker = new function (Prop, ImgLoader) {
    var FSO = Prop.Panel.FSO;
    var ImgSrcFmt = Prop.Image.SourceFormat;
    var ImgSrcStr = "";
    var MaxFileSize = Prop.Image.MaxFileSize;
    var CycleInWildCard = Prop.Cycle.CycleInWildCard;
    var GetEmbedImg = ImgLoader;
    var FoundFiles = new Array;
    var PathsArray;
    var PathCacheCapacity = Prop.Image.PathCacheCapacity;

    if (PathCacheCapacity) {
        // This cache array is similar to the images cache array.
        var PathsCache = new Array;
        PathsCache.FSO = FSO;

        PathsCache.cacheItem = function (path, files) {
            this.Path = path; 		// String.
            this.MatchFiles = files; 		// Must an array, path array.
        };

        for (var i = 0; i < PathCacheCapacity - 1; i++)
            PathsCache.push(new PathsCache.cacheItem(null, null))

        PathsCache.remove = RemoveFromArray;

        // Duplicate item will be overwritten.
        PathsCache.Store = function (path, files) {
            var c;
            if (this.SearchFor(path))
                this[0].MatchFiles = files;
            else if (c = this.pop()) {
                c.Path = path;
                c.MatchFiles = files;
                this.unshift(c);
            }
        };

        // Search in cache, returns the search result, and move it to the beginning of the cache array.
        // All files in result array will be checked before return, if one or more files doesn't exist, remove this item and return nothing.
        // If no result found, return nothing.
        PathsCache.SearchFor = function (path) {
            var i = 0;
            for (i; i < this.length; i++)
                if (this[i].Path == path)
                    break;

            if (i < this.length) {
                var c = this.remove(i);
                var rslt = c.MatchFiles;

                for (var j = 0; j < rslt.length; j++)		// Check whether all the files are exist.
                    if (!this.FSO.FileExists(rslt[j])) {
                        c.Path = null;
                        this.push(c);
                        return;
                    }

                this.unshift(c);
                return rslt;
            }
        };

        PathsCache.Clear = function () {
            for (var i = 0; i < this.length - 1; i++) {
                this[i].Path = null;
                this[i].MatchFiles = null;
            }
        };
    }

    // Union Array2 into Array1.
    var unionArray = function (Array1, Array2) {
        var seen = {};
        for (var i = 0; i < Array1.length; i++)
            seen[Array1[i]] = true;
        for (i = 0; i < Array2.length; i++)
            if (!seen[Array2[i]])
                Array1.push(Array2[i]);
    };

    // Calculate ImageSourceFormat, and replace <embed> <front> <back> <disc> <icon> <artist> with <rawpath>. <embed> == <front>.
    var CalcPathFmt = function (pathfmt, metadb) {
        var ArtId = ["front", "back", "disc", "icon", "artist"];
        var ArtIdRE = [/<front>/gi, /<back>/gi, /<disc>/gi, /<icon>/gi, /<artist>/gi];
        var paths;
        if (fb.GetFocusItem()) {
            if (metadb)
                paths = fb.TitleFormat(ImgSrcFmt).EvalWithMetadb(metadb)
            else
                paths = fb.TitleFormat(ImgSrcFmt).Eval();
            paths = paths.replace(/<embed>/gi, "<" + metadb.RawPath + ">");
            for (var i = 0; i < ArtIdRE.length; i++) {
                paths = paths.replace(ArtIdRE[i], "<" + metadb.RawPath + ArtId[i] + ">");
            }
        } else if (!Prop.Image.DefaultImagePath) {
            paths = DefaultImgPath;
        } else
            paths = Prop.Image.DefaultImagePath;
        //    		fb.trace("paths=" + paths);
        return paths;
    };

    // Check file type and file size.
    var IsFilePropOK = function (file) {
        var ext = FSO.GetExtensionName(file).toLowerCase();
        for (var i = 0; i < SupportTypes.length; i++) {
            if (ext == SupportTypes[i] && (MaxFileSize <= 0 || file.Size <= MaxFileSize))
                return true;
        }
        return false;
    };

    // Find matches image files in "ImgSrc", cache relational paths, return the valid paths array.
    // If "ImgSrc" has nothing changed, return the previous array directly.
    // If no valid path found, return an empty array.
    this.GetImgPaths = function (metadb) {
        var newsrc = CalcPathFmt(ImgSrcFmt, metadb);
        if (newsrc == ImgSrcStr)
            return FoundFiles; 	// If the source format has nothing changed, return the previous results directly.
        else
            ImgSrcStr = newsrc;

        PathsArray = ImgSrcStr.split("||");
        var NewFoundFiles = new Array;

        for (var i = 0; i < PathsArray.length; i++) {
            var Path = PathsArray[i];
            var SearchResults = PathsCache ? PathsCache.SearchFor(Path) : null;
            if (!SearchResults) {
                SearchResults = new Array;
                var EmbedPath = Path.match(/<.*>/);
                if (EmbedPath) {			// Check embed cover.
                    EmbedPath = EmbedPath.toString();
                    if (GetEmbedImg(EmbedPath))
                        SearchResults.push(EmbedPath);
                } else if (Path.indexOf("*") == -1 && Path.indexOf("?") == -1) {		// If not wildcard exist.
                    if (!FSO.FileExists(Path)) continue;
                    SearchResults.push(Path);
                } else {		// Search in wildcard.
                    var foldername = FSO.GetParentFolderName(Path);
                    if (!FSO.FolderExists(foldername)) continue;

                    if (CycleInWildCard) {
                        // Check file type and size first -----------------
                        var ValidFiles = PathsCache ? PathsCache.SearchFor(foldername + "\\*") : null; 	// Search in cache first.
                        if (!ValidFiles) {
                            ValidFiles = new Array;
                            var e = new Enumerator(FSO.GetFolder(foldername).Files);
                            for (; !e.atEnd() ; e.moveNext()) {
                                var file = e.item();
                                if (IsFilePropOK(file))
                                    ValidFiles.push(file.Path);
                            }
                            PathsCache && PathsCache.Store(foldername + "\\*", ValidFiles); 	// Store this step's result in cache.
                        }
                        // Then match wildcard ------------------
                        var exp = FSO.GetFileName(Path);
                        if (exp != "*" && exp != "*.*") {
                            for (var j = 0; j < ValidFiles.length; j++) {
                                if (utils.PathWildcardMatch(exp, FSO.GetFileName(ValidFiles[j])))
                                    SearchResults.push(ValidFiles[j]);
                            }
                        } else
                            SearchResults = ValidFiles;

                    } else {
                        exp = FSO.GetFileName(Path);
                        e = new Enumerator(FSO.GetFolder(foldername).Files);
                        for (; !e.atEnd() ; e.moveNext()) {
                            file = e.item();
                            if (IsFilePropOK(file) && utils.PathWildcardMatch(exp, file.Name)) {
                                SearchResults.push(file.Path);
                                break; 		// One file per path is enough.
                            }
                        }
                    }
                }
                PathsCache && PathsCache.Store(Path, SearchResults); 	// Store search results for this path.
            }
            // Merge these files of this path into the final results, duplicate files will only keep one.
            unionArray(NewFoundFiles, SearchResults);
        }

        if (NewFoundFiles.join() != FoundFiles.join())		// If the result has nothing changed, return the previous results directly.
            FoundFiles = NewFoundFiles;
        CollectGarbage(); 		// Release memory.
        return FoundFiles;
    };

    this.ClearCache = function () {
        PathsCache && PathsCache.Clear();
        ImgSrcStr = "";
    };

}(Properties, GetImg);

var GetImgPaths = PathChecker.GetImgPaths;


//====================================================
// Define Display Style =====================================
/* Define style, display image and animation.
Primarily provides the "ChangeImage()" method */
var Display = new function (Prop, ImgLoader) {
    var AdjustMargin = Prop.Image.AdjustMargin.split(",");
    this.margin = { top: parseInt(AdjustMargin[1]), left: parseInt(AdjustMargin[0]), bottom: parseInt(AdjustMargin[3]), right: parseInt(AdjustMargin[2]) };
    this.x = this.margin.left;
    this.y = this.margin.top;
    this.width;
    this.height;
    var FSO = Prop.Panel.FSO;
    var EnableFading = Prop.Cycle.Animation.Enable;
    var RefreshInterval = Prop.Cycle.Animation.RefreshInterval;
    var step = Math.min(Math.ceil(255 * RefreshInterval / Prop.Cycle.Animation.Duration), 255);
    var DefaultImg;
    var ext;
    if (!Prop.Image.DefaultImagePath) {
        DefaultImg = gdi.Image(DefaultImgPath);
        ext = FSO.GetExtensionName(DefaultImgPath).toLowerCase();
    } else {
        DefaultImg = gdi.Image(Prop.Image.DefaultImagePath);
        ext = FSO.GetExtensionName(Prop.Image.DefaultImagePath).toLowerCase();
    }
    var DefaultRaw = null;
    if (DefaultImg && ext != "png" && ext != "gif")
        DefaultRaw = DefaultImg.CreateRawBitmap();
    var ImgPath = null;
    var CurImage = DefaultImg;
    var CurRaw = DefaultRaw;
    var CurSize = null;
    var NewImage = null;
    var NewSize = null;
    var CanBeCreateRaw = true;
    var opacity = 255;
    var timer = null;
    //   var caseRaw = caseImg.CreateRawBitmap();

    if (ImgLoader)
        var GetImg = ImgLoader;
    else
        GetImg = function () {
            return gdi.Image(path);
        };

    // Change now displaying image to the new one.
    // "path" is a string object, or empty.
    // When "path" is empty, means change to style default image (DefaultImg).
    // "GroupChanged" means "GroupFormat" calculate result changes.
    this.ChangeImage = function (path, GroupChanged) {
        if ((ImgPath != null && path != undefined) && path == ImgPath) return;

        ImgPath = path;
        var newimg, newcase;

        if (ImgPath) {
            newimg = GetImg(ImgPath, this.width, this.height);
            var ext = FSO.GetExtensionName(ImgPath).toLowerCase();
            CanBeCreateRaw = ext != "png" && ext != "gif";
        } else
            newimg = DefaultImg;
        if (EnableFading) {
            if (NewImage) {
                CurImage = NewImage;
                //CurRaw = NewImage==DefaultImg ? DefaultRaw : (CanBeCreateRaw ? CurImage.CreateRawBitmap() : null);
                CurSize = NewSize;
                opacity = 255;
            }

            NewImage = newimg;
            NewSize = CalcNewImgSize(NewImage, this.width, this.height);
            if (!timer) timer = window.CreateTimerInterval(RefreshInterval);
        } else {
            CurImage = newimg;
            CurRaw = ImgPath ? (CanBeCreateRaw ? CurImage.CreateRawBitmap() : null) : DefaultRaw;
            CurSize = CalcNewImgSize(CurImage, this.width, this.height);
            window.RepaintRect(this.x, this.y, this.width, this.height);
        }
    };

    this.Refresh = function () {

        if (ImgPath) {
            CurImage = GetImg(ImgPath, this.width, this.height, true); 		// Get image bypass cache.
            if (CurRaw) CurRaw = CurImage.CreateRawBitmap();
        } else {
            if (!Prop.Image.DefaultImagePath)
                DefaultImg = gdi.Image(DefaultImgPath);
            else
                DefaultImg = gdi.Image(Prop.Image.DefaultImagePath);
            DefaultRaw = DefaultImg.CreateRawBitmap();
            CurImage = DefaultImg;
            CurRaw = DefaultRaw;
        }
        if (CurImage)
            CurSize = CalcNewImgSize(CurImage, this.width, this.height);
        if (NewImage)
            NewSize = CalcNewImgSize(NewImage, this.width, this.height);
        window.Repaint();
    };

    this.OnPaint = function (gr) {
        var Img, size;
        var CaseM = Properties.Case.ActiveCaseMode;
        var fixM = Properties.Case.fixSizeMode;
        var InsidePanel = Properties.Case.AdjustCaseSizeInsidePanel;
        var CaseOption = Properties.Case.ImageOption.split(",");
        if (Number(CaseOption[1]) < 0 || Number(CaseOption[1]) > 255)
            CaseOption[1] = 255;
        var CaseProp = IsGFilePropOK(Properties.Case.CaseImagePath);
        if (CaseM)
            if (CaseProp)
                var caseImg = gdi.Image(Properties.Case.CaseImagePath);
            else
                caseImg = gdi.Image(Properties.Panel.WorkDirectory + "case.png");
        var adjust = Prop.Case.AdjustCaseSize.split(",");
        var fixSize = Prop.Case.fixSizeValue.split(",");
        wwwh(fixSize);

        if (Img = CurImage) {
            size = CurSize;
            if (opacity == 255 && CurRaw)
                // This funtion is much more faster.
                gr.GdiDrawBitmap(CurRaw, this.x + size.x, this.y + size.y, size.width, size.height, 0, 0, Img.width, Img.height);
            else
                gr.DrawImage(Img, this.x + size.x, this.y + size.y, size.width, size.height, 0, 0, Img.width, Img.height, 0, opacity);
        }
        if (Img = NewImage) {
            size = NewSize;
            gr.DrawImage(Img, this.x + size.x, this.y + size.y, size.width, size.height, 0, 0, Img.width, Img.height, 0, 255 - opacity);
        }
        //ケースの描画 (画像データはgdi.Imageで取得(176行目), 座標(Artworkに合わせる時はsizeの結果を利用),X軸およびY軸リサイズ(同左),画像のどの範囲を切り取ってリサイズして描画するか(全体をリサイズ))
        if (CaseM) {
            if (fixM)
                gr.DrawImage(caseImg, fixSize[0], fixSize[1], fixSize[2], fixSize[3], 0, 0, caseImg.width, caseImg.height, angle = CaseOption[0], alpha = CaseOption[1]);
            else if (InsidePanel) {
                var xxx = (this.x + size.x - adjust[0] < 0) ? 0 : this.x + size.x - adjust[0];
                var yyy = (this.y + size.y - adjust[1] < 0) ? 0 : this.y + size.y - adjust[1];
                var www = (this.x + size.x + size.width + parseInt(adjust[2]) > ww) ? ww - xxx : (size.width + ((xxx == 0) ? this.x + size.x : parseInt(adjust[0])) + parseInt(adjust[2])); //xxx+parseInt(adjust[0]) == this.x+size.x
                var hhh = (this.y + size.y + size.height + parseInt(adjust[3]) > wh) ? wh - yyy : (size.height + ((yyy == 0) ? this.y + size.y : parseInt(adjust[1])) + parseInt(adjust[3])); //yyy+parseInt(adjust[1]) == this.y+size.y
                gr.DrawImage(caseImg, xxx, yyy, www, hhh, 0, 0, caseImg.width, caseImg.height, angle = CaseOption[0], alpha = CaseOption[1]);
            }
            else
                gr.DrawImage(caseImg, this.x + size.x - adjust[0], this.y + size.y - adjust[1], size.width + parseInt(adjust[0]) + parseInt(adjust[2]), size.height + parseInt(adjust[1]) + parseInt(adjust[3]), 0, 0, caseImg.width, caseImg.height, angle = CaseOption[0], alpha = CaseOption[1]);
        }
    };

    this.OnTimer = function (id) {
        if (timer && id == timer.ID) {
            if (opacity > 0) {
                opacity = Math.max(opacity - step, 0);
                if (Properties.Case.fixSizeMode)
                    window.RepaintRect(this.x, this.y, this.width, this.height);
                else
                    window.Repaint();
            } else {
                CurImage = NewImage;
                CurRaw = ImgPath ? (CanBeCreateRaw ? CurImage.CreateRawBitmap() : null) : DefaultRaw;
                CurSize = NewSize;
                NewImage = null;
                NewSize = null;
                opacity = 255;
                window.KillTimer(timer);
                timer.Dispose();
                timer = null;
                CollectGarbage(); 		// Release memory.
                //window.RepaintRect(this.x, this.y, this.width, this.height);
            }
        }
    };

    this.OnResize = function (ww, wh) {
        this.width = ww - this.margin.left - this.margin.right;
        this.height = wh - this.margin.top - this.margin.bottom;

        if (ImgPath) {
            CurImage = GetImg(ImgPath, this.width, this.height);
            if (CurRaw) CurRaw = CurImage.CreateRawBitmap();
        }
        if (CurImage)
            CurSize = CalcNewImgSize(CurImage, this.width, this.height);
        if (NewImage)
            NewSize = CalcNewImgSize(NewImage, this.width, this.height);
    };

}(Properties, GetImg);


//====================================================
// Define Main Controller ====================================
/* Main controller of the panel,
controls images loading, changing, cycle, and paths checking */
var Controller = new function (Prop, GetImgPaths, Dsp) {
    var CycleEnabled = Prop.Cycle.Enable;
    this.CycleActivated = false;
    var CyclePeriod = Prop.Cycle.Period;
    var GroupFmt = Prop.Image.GroupFormat;
    var GroupStr = null;
    var ImgPaths = null;
    this.CurImgPath = null;
    var CurImgIdx = 0;
    this.Paused = window.GetProperty("Cycle.Paused", !CycleEnabled);
    var timer = null;
    var _this = this;

    var ChangeImg = function (arg, GroupChanged) {
        switch (arg) {
            case 2: 	// Last
                CurImgIdx = ImgPaths.length - 1;
                break;
            case 1: 	// Next
                CurImgIdx = CurImgIdx + 1 < ImgPaths.length ? CurImgIdx + 1 : 0;
                break;
            case -1: 	// Previous
                CurImgIdx = CurImgIdx - 1 >= 0 ? CurImgIdx - 1 : ImgPaths.length - 1;
                break;
            case -2: 	// First
                CurImgIdx = 0;
                break;
            default: 	// Default
                arg = 0;
        }
        var path = arg ? ImgPaths[CurImgIdx] : null;
        toDefault(path ? false : true);

        if (!GroupChanged && path == _this.CurImgPath)
            return;
        else
            _this.CurImgPath = path;

        Controller.CurrentPath = _this.CurImgPath;
        Dsp.ChangeImage(_this.CurImgPath, GroupChanged);
        DeleteReservedPath && CreateDeleteTimer();
    };

    var ResetTimer = function () {
        if (!timer) return;
        window.KillTimer(timer);
        timer.Dispose();
        timer = window.CreateTimerInterval(CyclePeriod);
        CollectGarbage(); 		// Release memory.
    };

    this.Play = function () {
        this.Paused = false;
        window.SetProperty("Cycle.Paused", this.Paused);
        if (!this.CycleActivated) return;
        if (!timer) timer = window.CreateTimerInterval(CyclePeriod);
    };

    this.Pause = function (p) {
        if (!p) {
            this.Paused = true;
            window.SetProperty("Cycle.Paused", this.Paused);
        }
        if (!this.CycleActivated) return;
        if (timer) {
            window.KillTimer(timer);
            timer.Dispose();
            timer = null;
            CollectGarbage(); 		// Release memory.
        }
    };

    this.Next = function () {
        if (!this.CycleActivated) return;
        ResetTimer();
        ChangeImg(1);
    };

    this.Previous = function () {
        if (!this.CycleActivated) return;
        ResetTimer();
        ChangeImg(-1);
    };

    this.First = function () {
        if (!this.CycleActivated) return;
        ResetTimer();
        ChangeImg(-2);
    };

    this.Last = function () {
        if (!this.CycleActivated) return;
        ResetTimer();
        ChangeImg(2);
    };

    this.OnNewTrack = function (metadb, followcur) {
        var NewImgPaths = GetImgPaths(metadb);
        if (metadb)
            var groupstr = fb.TitleFormat(GroupFmt).EvalWithMetadb(metadb)
        else
            groupstr = fb.TitleFormat(GroupFmt).Eval();
        if (GroupStr != groupstr) {
            GroupStr = groupstr;
            var IsNewGroup = true;
        } else
            IsNewGroup = false;
        if (ImgPaths != NewImgPaths || IsNewGroup) {
            ImgPaths = NewImgPaths;
            if (ImgPaths.length <= 1)
                SetCycleStatus(false);
            else
                SetCycleStatus(CycleEnabled);
            ResetTimer();
            Number(Prop.Cycle.Shuffle) && ImgPaths.shuffle(Prop.Cycle.Shuffle - 1);
            ChangeImg(-2, IsNewGroup);
        }

        if (followcur && Prop.Cycle.AutoPauseWhenFollowCursor) {
            this.Pause(true);
            if (CurImgIdx != 0)
                ChangeImg(-2);
        } else
            !this.Paused && this.Play();
    };

    this.OnStop = function (reason) {
        if (timer) {
            window.KillTimer(timer);
            timer.Dispose();
            timer = null;
            CollectGarbage();
        }
        if (reason <= 1)
            ChangeImg();
        if (reason != 2) {
            this.Pause(true);
            SetCycleStatus(false);
            ImgPaths = null;
            this.CurImgPath = null;
            CurImgIdx = 0;
            GroupStr = null;
        }
    };

    this.OnTimer = function (id) {
        if (timer && id == timer.ID)
            this.Next();
    };

}(Properties, GetImgPaths, Display);


//====================================================
// Define Control Buttons ===================================
/* All button's funtions are calls of Controller's method */
if (Properties.Buttons.Display && Properties.Cycle.Enable) {
    var Buttons = new function (Prop, Ctrl) {
        var BtnDir = Prop.Panel.WorkDirectory;
        var lang = Prop.Panel.lang;
        var Position = Prop.Buttons.Position;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        var opacity = 0;
        var defaultOp = 150;
        var hbtn = null;
        var dbtn = null;
        var timer = null;
        var RefreshInterval = 50;
        var step = 40;
        var dstOp = 0;
        var _this = this;
        this.BtnsArray = new Array();

        // Define button class ------------------------------------------------
        var Button = function (x, y, img, OnClick, tiptext) {
            this.x = x;
            this.y = y;
            this.width = img.width / 4;
            this.height = img.height;
            this.Img = img;
            this.tiptext = tiptext;
            this.state = 3; 	// 0=normal, 1=hover, 2=down, 3=disabled
            this.enabled = false;
            this.OnClick = OnClick;
            var Tooltip = Prop.Panel.Tooltip;

            this.isXYinBtn = function (x, y) {
                if (!this.enabled) return false;
                return (x >= this.x && y >= this.y && x <= this.x + this.width && y <= this.y + this.height) ? true : false;
            };

            this.Draw = function (gr, op) {
                if (!opacity) return;
                gr.DrawImage(this.Img, this.x, this.y, this.width, this.height, this.state * this.Img.width / 4, 0, this.width, this.height, 0, opacity);
            };

            this.ChangeState = function (s, enabled) {
                //if (!this.enabled && !enabled) return;
                if (enabled === undefined) {
                    if (s == this.state)
                        return;
                    else
                        this.state = s;
                } else {
                    this.enabled = enabled;
                    this.state = enabled ? 0 : 3;
                }
                if (s == 1) {
                    Tooltip.Text = this.tiptext;
                    Tooltip.Activate();
                } else
                    Tooltip.Deactivate();
                if (opacity)
                    window.RepaintRect(this.x, this.y, this.width, this.height);
            };
        };

        // Create buttons --------------------------------
        var img_play = gdi.Image(BtnDir + "Play.png");
        var img_pause = gdi.Image(BtnDir + "Pause.png");
        var img_next = gdi.Image(BtnDir + "Next.png");
        var img_prev = gdi.Image(BtnDir + "Prev.png");
        var xOffset = this.x;
        this.BtnsArray.push(new Button(xOffset, this.y, img_prev, function () { Ctrl.Previous(); }, lang == "ja" ? "前の画像" : "Previous Image"));
        xOffset += this.BtnsArray[this.BtnsArray.length - 1].width;
        this.BtnsArray.push(PlayBtn = new Button(xOffset, this.y, img_play, function () { SetPauseStatus(Ctrl.Paused) }, ""));
        xOffset += this.BtnsArray[this.BtnsArray.length - 1].width;
        this.BtnsArray.push(new Button(xOffset, this.y, img_next, function () { Ctrl.Next(); }, lang == "ja" ? "次の画像" : "Next Image"));
        xOffset += this.BtnsArray[this.BtnsArray.length - 1].width;

        PlayBtn.tiptext_play = lang == "ja" ? "サイクル開始" : "Cycle Covers";
        PlayBtn.tiptext_pause = lang == "ja" ? "一時停止" : "Pause Cycle";
        PlayBtn.tiptext = Ctrl.Paused ? PlayBtn.tiptext_play : PlayBtn.tiptext_pause;
        PlayBtn.img_pause = img_pause;
        PlayBtn.img_play = img_play;
        PlayBtn.Img = Ctrl.Paused ? PlayBtn.img_play : PlayBtn.img_pause;
        PlayBtn.ChangeState(null, true);
        this.PlayBtn = PlayBtn;

        this.width = xOffset - this.x;
        this.height = PlayBtn.height;
        //---------------------------------------
        this.SetCycleStatus = function (s) {
            this.BtnsArray[0].ChangeState(null, s);
            this.BtnsArray[2].ChangeState(null, s);
        };

        this.SetPauseStatus = function (s) {
            if (s) {
                PlayBtn.Img = PlayBtn.img_pause;
                PlayBtn.tiptext = PlayBtn.tiptext_pause;
            } else {
                PlayBtn.Img = PlayBtn.img_play;
                PlayBtn.tiptext = PlayBtn.tiptext_play;
            }
        };

        var isXYinBtns = function (x, y) {
            return (x >= _this.x && y >= _this.y && x <= _this.x + _this.width && y <= _this.y + _this.height) ? true : false;
        };

        this.isXYinBtns = isXYinBtns;

        var Fading = function (dstop) {
            if (dstOp == dstop) return;
            dstOp = dstop;
            if (!timer) timer = window.CreateTimerInterval(RefreshInterval);
        };

        this.OnPaint = function (gr) {
            if (!opacity) return;
            for (var i = 0; i < this.BtnsArray.length; i++)
                this.BtnsArray[i].Draw(gr, opacity);
        };

        this.OnMouseMove = function (x, y) {
            if (isXYinBtns(x, y)) {
                if (opacity != 255) {
                    dstOp = 255;
                    opacity = 255;
                    window.RepaintRect(this.x, this.y, this.width, this.height);
                }
            } else if (opacity != defaultOp)
                Fading(defaultOp);

            if (dbtn) {
                if (dbtn.isXYinBtn(x, y))
                    dbtn.ChangeState(2);
                else
                    dbtn.ChangeState(1);
            } else {
                for (var i = 0; i < this.BtnsArray.length; i++)
                    if (this.BtnsArray[i].isXYinBtn(x, y)) {
                        if (hbtn != this.BtnsArray[i]) {
                            if (hbtn) hbtn.ChangeState(0);
                            hbtn = this.BtnsArray[i];
                            hbtn.ChangeState(1);
                        }
                        break;
                    }
                if (i == this.BtnsArray.length) {
                    if (hbtn) {
                        hbtn.ChangeState(0);
                        hbtn = null;
                    }
                }
            }
        };

        this.OnLbtnDown = function (x, y) {
            if (hbtn) {
                dbtn = hbtn;
                dbtn.ChangeState(2);
            }
        };

        this.OnLbtnUp = function (x, y) {
            if (dbtn) {
                if (dbtn.state == 2) {
                    dbtn.OnClick();
                    dbtn.ChangeState(1);
                }
                dbtn = null;
                this.OnMouseMove(x, y);
            }
        };

        this.OnMouseLeave = function () {
            Fading(0);
            if (hbtn) {
                hbtn.ChangeState(0);
                hbtn = null;
            }
        };

        this.OnTimer = function (id) {
            if (timer && id == timer.ID) {
                if (opacity == dstOp) {
                    window.KillTimer(timer);
                    timer.Dispose();
                    timer = null;
                    CollectGarbage(); 		// Release memory.
                    //window.RepaintRect(this.x, this.y, this.width, this.height);
                } else {
                    if (opacity < dstOp)
                        opacity = Math.min(opacity + step, dstOp);
                    else
                        opacity = Math.max(opacity - step, dstOp);
                    window.RepaintRect(this.x, this.y, this.width, this.height);
                }
            }
        };

        this.OnResize = function (ww, wh) {
            if (Position == 1 || Position == 4)
                this.x = (ww - this.width) / 2;
            else if (Position == 2 || Position == 5)
                this.x = ww - this.width;

            if (Position > 2)
                this.y = wh - this.height;

            var x = this.x;
            for (var i = 0; i < this.BtnsArray.length; i++) {
                this.BtnsArray[i].x = x;
                x += this.BtnsArray[i].width;
                this.BtnsArray[i].y = this.y;
            };
            this.width = x - this.x;
        };

    }(Properties, Controller);

} else
    Buttons = {};


//====================================================
// Functions Menu ========================================
var FuncMenu = new function (Prop, Ctrl, Dsp, Btns, ImgLoader, ImgFinder) {
    // Flags ----------
    var MF_SEPARATOR = 0x00000800;
    var MF_ENABLED = 0x00000000;
    var MF_GRAYED = 0x00000001;
    var MF_DISABLED = 0x00000002;
    var MF_UNCHECKED = 0x00000000;
    var MF_CHECKED = 0x00000008;
    var MF_STRING = 0x00000000;
    var MF_POPUP = 0x00000010;
    var MF_RIGHTJUSTIFY = 0x00004000;

    var lang = Prop.Panel.lang;
    var ItemList = {};
    var ItemID = 1;

    var BuildMenu = function (items) {
        var menu = window.CreatePopupMenu();
        var mf, id, radio;
        for (var i = 0; i < items.length; i++) {
            mf = items[i].Flag || MF_STRING;
            id = items[i].ID || ItemID++;
            menu.AppendMenuItem(mf, id, items[i].Caption);
            if (i == items.Radio)
                radio = id;
            ItemList[id] = items[i];
        }
        radio && menu.CheckMenuRadioItem(1, items.length, radio);
        return menu;
    };

    // Submenu: Follow Cursor -------------------------
    var Menu_FC_Items = new Array(
		{
		    Caption: lang == "ja" ? "非再生時のみ" : "Only when not playing",
		    Func: function () {
		        if (Prop.Panel.FollowCursor == 1) return;
		        Prop.Panel.FollowCursor = 1;
		        window.SetProperty("Panel.FollowCursor", 1);
		        Menu_FC_Items.Radio = 0;
		        if (fb.IsPlaying)
		            on_playback_new_track(fb.GetNowPlaying());
		        else
		            on_item_focus_change(fb.GetFocusItem());
		        RebuildMenu();
		    }
		},
		{
		    Caption: lang == "ja" ? "常にする" : "Always",
		    Func: function () {
		        if (Prop.Panel.FollowCursor == 2) return;
		        Prop.Panel.FollowCursor = 2;
		        window.SetProperty("Panel.FollowCursor", 2);
		        Menu_FC_Items.Radio = 1;
		        on_item_focus_change(fb.GetFocusItem());
		        RebuildMenu();
		    }
		},
		{
		    Caption: lang == "ja" ? "しない" : "Never",
		    Func: function () {
		        if (Prop.Panel.FollowCursor == 0) return;
		        Prop.Panel.FollowCursor = 0;
		        window.SetProperty("Panel.FollowCursor", 0);
		        Menu_FC_Items.Radio = 2;
		        if (fb.IsPlaying)
		            on_playback_new_track(fb.GetNowPlaying());
		        else
		            on_playback_stop(0);
		        RebuildMenu();
		    }
		}
	);
    var fc = Prop.Panel.FollowCursor;
    Menu_FC_Items.Radio = fc == 1 ? 0 : fc == 2 ? 1 : fc == 0 ? 2 : null;
    var Menu_SubItem_FC = {
        Flag: MF_POPUP,
        Caption: lang == "ja" ? "カーソルを追従" : "Follow Cursor",
        ID: null
    }

    // Submenu: Image Stretching ----------------------
    var Menu_IS_Items = new Array(
		{
		    Flag: Prop.Image.Stretch ? MF_CHECKED : MF_UNCHECKED,
		    Caption: lang == "ja" ? "画像を引き伸ばす" : "Stretch Image",
		    Func: function () {
		        Prop.Image.Stretch = !Prop.Image.Stretch;
		        window.SetProperty("Image.Stretch", Prop.Image.Stretch);
		        this.Flag = Prop.Image.Stretch ? MF_CHECKED : MF_UNCHECKED;
		        Dsp && Dsp.Refresh();
		        RebuildMenu();
		    }
		},
		{
		    Flag: Prop.Image.KeepAspectRatio ? MF_CHECKED : MF_UNCHECKED,
		    Caption: lang == "ja" ? "アスペクト比を維持する" : "Keep Aspect Ratio",
		    Func: function () {
		        Prop.Image.KeepAspectRatio = !Prop.Image.KeepAspectRatio;
		        window.SetProperty("Image.KeepAspectRatio", Prop.Image.KeepAspectRatio);
		        this.Flag = Prop.Image.KeepAspectRatio ? MF_CHECKED : MF_UNCHECKED;
		        Dsp && Dsp.Refresh();
		        RebuildMenu();
		    }
		}
	);
    var Menu_SubItem_IS = {
        Flag: MF_POPUP,
        Caption: lang == "ja" ? "画像の伸張" : "Image Stretching",
        ID: null
    }

    // Main menu --------------------------------
    var Item_cycle = {
        Flag: MF_ENABLED,
        cap_play: lang == "ja" ? "オートサイクル開始" : "Resume Cycle",
        cap_pause: lang == "ja" ? "オートサイクル停止" : "Pause Cycle",
        Caption: null,
        Func: function () { Ctrl && SetPauseStatus(Ctrl.Paused); }
    };
    Item_cycle.Caption = Ctrl.Paused ? Item_cycle.cap_play : Item_cycle.cap_pause;

    var Item_VWEV, Item_OIF;
    var Menu_Items = new Array(
		Item_cycle,
		{
		    Flag: MF_GRAYED,
		    Caption: lang == "ja" ? "前の画像" : "Previous Image",
		    Func: function () { Ctrl & Ctrl.Previous(); }
		},
		{
		    Flag: MF_GRAYED,
		    Caption: lang == "ja" ? "次の画像" : "Next Image",
		    Func: function () { Ctrl && Ctrl.Next(); }
		},
		{
		    Flag: MF_GRAYED,
		    Caption: lang == "ja" ? "最初の画像" : "First Image",
		    Func: function () { Ctrl && Ctrl.First(); }
		},
		{
		    Flag: MF_GRAYED,
		    Caption: lang == "ja" ? "最後の画像" : "Last Image",
		    Func: function () { Ctrl && Ctrl.Last(); }
		},
    //--------------------------------------------------------------
		Item_VWEV = {
		    Flag: MF_GRAYED,
		    Caption: lang == "ja" ? "外部ビューアで開く" : "View With External Viewer",
		    Func: function () {
		        var ExPath = Prop.Panel.ExternalViewer;
		        var path = Ctrl.CurImgPath;
		        if (!path) return;
		        if (path.charAt(0) == "<" && Prop.Image.EmbedImageSubstitutedPath) {
		            if (fb.GetFocusItem() && (Properties.Panel.FollowCursor == 2 || (Properties.Panel.FollowCursor == 1 && !fb.IsPlaying)))
		                path = fb.TitleFormat(Prop.Image.EmbedImageSubstitutedPath).EvalWithMetadb(fb.GetFocusItem());
		            else
		                path = fb.TitleFormat(Prop.Image.EmbedImageSubstitutedPath).Eval();
		            fb.ShowPopupMessage(lang == "ja" ? "これは埋込み画像です. 指定パスを開きます." : "This image is embed image.", "WSH Cover Panel Mod", 1);
		        } else if (path.charAt(0) == "<") {
		            fb.ShowPopupMessage(lang == "ja" ? "これは埋込み画像のため, 外部ビューアで開けません. （代わりに開くパスをプロパティで設定できます）" : "This image is embed image, can't be displayed in external viewer. (You can set a substituted path on Properties)", "WSH Cover Panel Mod", 1);
		            return;
		        }
		        if (!ExPath)
		            FuncCommand(path);
		        else
		            FuncCommand(ExPath + " " + path);
		    }
		},
		Item_OIF = {
		    Flag: MF_GRAYED,
		    Caption: lang == "ja" ? "画像フォルダを開く" : "Open Containing Folder",
		    Func: function () {
		        var path = Ctrl.CurImgPath;
		        if (!path) return;
		        if (path.charAt(0) == "<")
		            path = path.substring(1, path.length - 1);
		        FuncCommand("explorer.exe /select," + path);
		    }
		},
		{
		    Flag: MF_SEPARATOR		// Insert separator.
		},
		{
		    Caption: lang == "ja" ? "現在の画像を削除" : "Delete Current Image",
		    Func: function () { DeleteReserve(Controller.CurrentPath); }
		},
		{
		    Flag: MF_SEPARATOR		// Insert separator.
		},
		Menu_SubItem_IS			// Insert "Image Stretching" submenu.
		,
		Menu_SubItem_FC			// Insert "Follow Cursor" submenu.
		,
		{
		    Flag: MF_SEPARATOR
		},
		{
		    Caption: lang == "ja" ? "更新" : "Refresh Image",
		    Func: function () { Dsp && Dsp.Refresh(); }
		},
		{
		    Flag: (Prop.Image.ImageCacheCapacity || Prop.Image.PathCacheCapacity) ? MF_ENABLED : MF_GRAYED,
		    Caption: lang == "ja" ? "キャッシュを削除" : "Clear Cache",
		    Func: function () {
		        ImgLoader && ImgLoader.ClearCache();
		        ImgFinder && ImgFinder.ClearCache();
		        CollectGarbage(); 		// Release memory.
		    }
		},
		{
		    Flag: MF_SEPARATOR
		},
		{
		    Caption: lang == "ja" ? "設定..." : "WSH Cover Properties...",
		    Func: function () { window.ShowProperties(); }
		},
		{
		    Caption: lang == "ja" ? "ヘルプ..." : "Help...",
		    Func: function () {
		        var HelpFile = Prop.Panel.WorkDirectory + "WSH_Cover_Mod_Properties_Help_ja.txt";
		        if (!Prop.Panel.FSO.FileExists(HelpFile)) {
		            fb.ShowPopupMessage(Prop.Panel.lang == "ja" ? "ヘルプファイル " + HelpFile + " が見つかりません." : "Can not find file " + HelpFile + " .", "WSH Cover Panel Mod", 1);
		            return;
		        }
		        FuncCommand(HelpFile);
		        //				var file = Prop.Panel.FSO.OpenTextFile(HelpFile, 1);
		        //				var txt = file.ReadAll();
		        //				fb.ShowPopupMessage(txt, "WSH Cover Panel Mod", 2);
		        //				file.Close();
		    }
		}
	);

    if (Prop.Panel.ShowConfigureMenu) {
        var Menu_PopTmp = Menu_Items.pop();
        var Menu_Configure = {
            Caption: lang == "ja" ? "スクリプト..." : "Configure...",
            Func: function () { window.ShowConfigure(); }
        }
        Menu_Items.push(Menu_Configure);
        Menu_Items.push(Menu_PopTmp);
        this.Help = Menu_Items[18].Func;
    } else
        this.Help = Menu_Items[17].Func;

    this.ViewWithExternalViewer = Item_VWEV.Func;
    this.OpenContainingFolder = Item_OIF.Func;
    this.FCmode1 = Menu_FC_Items[0].Func;
    this.FCmode2 = Menu_FC_Items[1].Func;
    this.ClearCache = Menu_Items[14].Func;
    this.WshCoverProperties = Menu_Items[16].Func;
    this.FirstImage = Menu_Items[3].Func;
    this.LastImage = Menu_Items[4].Func;
    this.Menu_Items = Menu_Items;
    var Menu, Menu_FC;

    var RebuildMenu = function () {
        ItemList = {};
        ItemID = 1;
        Menu_FC = BuildMenu(Menu_FC_Items);
        Menu_SubItem_FC.ID = Menu_FC.ID;
        Menu_IS = BuildMenu(Menu_IS_Items);
        Menu_SubItem_IS.ID = Menu_IS.ID;
        Menu = BuildMenu(Menu_Items);
    };

    this.RebuildMenu = RebuildMenu;
    RebuildMenu();

    this.Show = function (x, y) {
        var ret = Menu.TrackPopupMenu(x, y);
        if (ret != 0)
            ItemList[ret].Func();
    };

    this.SetCycleStatus = function (s) {
        for (var i = 1; i < 5; i++)
            Menu_Items[i].Flag = s ? MF_ENABLED : MF_GRAYED;
        RebuildMenu();
    };

    this.SetPauseStatus = function (s) {
        if (s)
            Item_cycle.Caption = Item_cycle.cap_pause;
        else
            Item_cycle.Caption = Item_cycle.cap_play;
        RebuildMenu();
    };

    var IsDefaultImg = true;
    this.toDefault = function (s) {
        if (s == IsDefaultImg) return;
        IsDefaultImg = s;
        Item_VWEV.Flag = s ? MF_GRAYED : MF_ENABLED;
        Item_OIF.Flag = s ? MF_GRAYED : MF_ENABLED;
        RebuildMenu();
    };

}(Properties, Controller, Display, Buttons, ImageLoader, PathChecker);


//====================================================
function SetCycleStatus(s) {
    Controller.CycleActivated = s;
    Buttons.SetCycleStatus && Buttons.SetCycleStatus(s);
    FuncMenu && FuncMenu.SetCycleStatus(s);
}

function SetPauseStatus(s) {
    if (s)
        Controller.Play();
    else
        Controller.Pause();
    Buttons.SetPauseStatus && Buttons.SetPauseStatus(s);
    FuncMenu && FuncMenu.SetPauseStatus(s);
}

function toDefault(s) {
    FuncMenu && FuncMenu.toDefault(s);
}

function Tooltip2() {
    //   var tip2 = null;
    var tip2 = window.CreateTooltip();
    tip2.Deactivate();
    if (Properties.Panel.FollowCursor == 2)
        var cMode = Properties.Panel.lang == "ja" ? "常に追従する" : "Follow Cursor";
    else
        cMode = Properties.Panel.lang == "ja" ? "非再生時のみ追従" : "Now playing";
    tip2.Text = cMode;
    tip2.SetDelayTime(3, 10);
    tip2.Activate();
}

function FuncCommand(path) {
    if (!path.match(/(?:\\|:\/\/)/))
        fb.RunMainMenuCommand(path);
    else {
        var ar, arg = null;
        if (!Properties.Panel.ShellObj)
            Properties.Panel.ShellObj = new ActiveXObject("Shell.Application");
        if (path.match(/(.*?\.\w{2,4})\s(.*)/)) {
            path = RegExp.$1;
            ar = RegExp.$2.charAt(0);
            arg = (ar != '"' && ar != "/") ? '"' + RegExp.$2 + '"' : RegExp.$2;
        }
        Properties.Panel.ShellObj.ShellExecute(path, arg, "", "open", 1);
    }
}

function Playlist_jump(d) {
    var pn = fb.ActivePlaylist + d;
    if (pn >= fb.PlaylistCount)
        fb.ActivePlaylist = 0;
    else if (pn < 0)
        fb.ActivePlaylist = fb.PlaylistCount - 1;
    else
        fb.ActivePlaylist = pn;
}

function DeleteReserve(path) { // 削除予約
    !Properties.Panel.WshShell && (Properties.Panel.WshShell = new ActiveXObject("WScript.Shell"));
    if (!path)
        Properties.Panel.WshShell.Popup(Properties.Panel.lang == "ja" ? "デフォルト画像は削除できません。" : "Can't delete a default image. ", 0, "情報", 64);
    else if (path.indexOf("<") != 1 && IsGFilePropOK(path)) {
        if (!Controller.CycleActivated) {
            Properties.Panel.WshShell.Popup(Properties.Panel.lang == "ja" ? "画像を削除できません。\n削除するには2枚以上の表示画像が必要です。" : "Can't delete it. ", 0, "情報", 64);
            return;
        }
        var n = Properties.Panel.WshShell.Popup(Properties.Panel.lang == "ja" ? "画像を削除しますか?" : "Delete?", 0, "確認", 36);
        if (n == 7) return;
        DeleteReservedPath = path;
        Controller.Next();
    }
    else {
        Properties.Panel.WshShell.Popup(Properties.Panel.lang == "ja" ? "埋め込み画像は削除できません。" : "Can't delete it for embed image.", 0, "情報", 64);
    }
}

function CreateDeleteTimer() { // ファイルロック回避タイマー
    DeleteTimer = window.CreateTimerTimeout(Properties.Cycle.Animation.Duration + 100);
}

function DeleteReservedImage() { // 削除実行
    try {
        Properties.Panel.FSO.DeleteFile(DeleteReservedPath, false);
    } catch (e) {
        Properties.Panel.WshShell.Popup(Properties.Panel.lang == "ja" ? "ファイルがロックされているか、読み取り専用のため\n削除できません。" : "Can't delete it because image is locked or read only", 0, "情報", 64);
    }
    window.KillTimer(DeleteTimer);
    DeleteTimer.Dispose();
    DeleteTimer = null;
    DeleteReservedPath = null;
    !e && FuncMenu.ClearCache();
    CollectGarbage();
    if (e) {
        Controller.Previous();
        return;
    }
    //    Properties.Panel.WshShell.Popup(Properties.Panel.lang == "ja" ? "ファイルを削除しました。" : "Finished.", 0, "情報", 64);
    if (fb.GetFocusItem() && (Properties.Panel.FollowCursor == 2 || (Properties.Panel.FollowCursor == 1 && !fb.IsPlaying)))
        Controller.OnNewTrack && Controller.OnNewTrack(fb.GetFocusItem(), true);
    else
        Controller.OnNewTrack && Controller.OnNewTrack(fb.GetNowPlaying(), false);
}

function ClickAction(c) {
    var file;
    switch (c) {
        case '0':
            break;
        case '1':
            FuncMenu.ViewWithExternalViewer();
            break;
        case '2':
            FuncMenu.OpenContainingFolder();
            break;
        case '3':
            if (Properties.Panel.FollowCursor == 2) FuncMenu.FCmode1();
            else FuncMenu.FCmode2();
            //            Tooltip2();
            break;
        case '4':
            FuncMenu.WshCoverProperties();
            break;
        case '5':
            FuncMenu.Help();
            break;
        case '6':
            FuncMenu.FirstImage();
            break;
        case '7':
            FuncMenu.LastImage();
            break;
        case '8':
            fb.PlayOrPause();
            break;
        case '9':
            fb.Stop();
            break;
        case '10':
            fb.Random();
            break;
        case '11':
            fb.VolumeMute();
            break;
        case '12':
            var fbtf = fb.GetFocusItem() && (Properties.Panel.FollowCursor == 2 || (Properties.Panel.FollowCursor == 1 && !fb.IsPlaying));
            FuncCommand(fb.TitleFormat(Properties.Panel.RunCommand).EvalWithMetadb(fbtf ? fb.GetFocusItem() : fb.GetNowPlaying()));
            break;
        case '13':
            fbtf = fb.GetFocusItem() && (Properties.Panel.FollowCursor == 2 || (Properties.Panel.FollowCursor == 1 && !fb.IsPlaying));
            fb.RunContextCommandWithMetadb(Properties.Panel.RunContextCommand, fbtf ? fb.GetFocusItem() : fb.GetNowPlaying());
            break;
        case '14':
            fb.ShowPreferences();
            break;
        case '15':
            window.ShowConfigure();
            break;
        case '16':
            FuncCommand(fb.ProfilePath);
            break;
        case '17':
            FuncCommand(fb.FoobarPath);
            break;
        case '18':
            Playlist_jump(1);
            break;
        case '19':
            Playlist_jump(-1);
            break;
        case '20':
            DeleteReserve(Controller.CurrentPath);
            break;
        case '21':
            fbtf = fb.GetFocusItem() && (Properties.Panel.FollowCursor == 2 || (Properties.Panel.FollowCursor == 1 && !fb.IsPlaying));
            if (fbtf || fb.IsPlaying) {
                file = fb.TitleFormat(Properties.Text.FilePath).EvalWithMetadb(fbtf ? fb.GetFocusItem() : fb.GetNowPlaying());
                window.NotifyOthers("Lyric Show Modoki", file);
            }
            break;
    }
}


//====================================================
// BackGround ===========================================
var bgcolor = Properties.Panel.BackGroundColor;
if (bgcolor)
    bgcolor = RGBA(bgcolor[0], bgcolor[1], bgcolor[2], bgcolor[3]);


//====================================================
//====================================================
on_item_focus_change();

function on_paint(gr) {
    if (dragging)
        gr.FillSolidRect(0, 0, ww, wh, dragbgcolor);
    else if (bgcolor)
        gr.FillSolidRect(0, 0, ww, wh, bgcolor);
    gr.SetSmoothingMode(Properties.Image.SmoothingMode);
    gr.SetInterpolationMode(Properties.Image.InterpolationMode);
    if (BackProp)
        gr.DrawImage(BackgroundImg, BackOption[0], BackOption[1], BackOption[2], BackOption[3], 0, 0, BackgroundImg.width, BackgroundImg.Height, angle = BackOption[4], alpha = BackOption[5]);
    Display.OnPaint && Display.OnPaint(gr);
    Buttons.OnPaint && Buttons.OnPaint(gr);
}
function on_size() {
    if (!window.Width || !window.Height) return;
    ww = window.Width;
    wh = window.Height;
    Display.OnResize && Display.OnResize(ww, wh);
    Buttons.OnResize && Buttons.OnResize(ww, wh);
    if (fb.IsPlaying) {
        var metadb = fb.GetNowPlaying();
        on_playback_new_track(metadb);
    }
}
// Drag events ----------------------------------------------
function on_drag_enter() {
    dragging = true;
    window.Repaint();
}
function on_drag_leave() {
    dragging = false;
    window.Repaint();
}
function on_drag_drop(action) {
    if (Properties.Panel.DragDropPlaylistName == "auto")
        var playlist_name = "";
    else
        playlist_name = fb.TitleFormat(Properties.Panel.DragDropPlaylistName).EvalWithMetadb(fb.GetFocusItem());
    var idx = -1;

    // Find the playlist first.
    for (var i = 0; i < fb.PlaylistCount; ++i) {
        if (fb.GetPlaylistName(i) == playlist_name) {
            idx = i;
            break;
        }
    }
    // If not found, then create one.
    if (idx == -1)
        idx = fb.CreatePlaylist(fb.PlaylistCount, playlist_name);

    // dropイベントが発生した場合、on_drag_leave関数は呼ばれないため、以下2行の記述が必要.
    dragging = false;
    window.Repaint();

    // We are going to process the dropped items to a playlist.
    action.Playlist = idx;
    action.ToSelect = Properties.Panel.DragDropToSelect;
    action.ToPlaylist();
}
// Track events ---------------------------------------------
function on_item_focus_change() {
    if (fb.GetFocusItem() && (Properties.Panel.FollowCursor == 2 || (Properties.Panel.FollowCursor == 1 && !fb.IsPlaying)))
        Controller.OnNewTrack && Controller.OnNewTrack(fb.GetFocusItem(), true);
}
function on_playlist_switch() {
    if (Properties.Panel.FollowCursor == 2 || (Properties.Panel.FollowCursor == 1 && !fb.IsPlaying))
        Controller.OnNewTrack && Controller.OnNewTrack(fb.GetFocusItem(), true);
}
function on_playback_new_track(metadb) {
    if (Properties.Panel.FollowCursor <= 1) {
        Controller.OnNewTrack && Controller.OnNewTrack(metadb);
    }
}
function on_playback_stop(reason) {
    var metadb = fb.GetFocusItem();
    if (Properties.Panel.FollowCursor == 0 || !metadb)
        Controller.OnStop && Controller.OnStop(reason);
    else if (Properties.Panel.FollowCursor == 1 && reason != 2)
        Controller.OnNewTrack && Controller.OnNewTrack(metadb, true);
}
// Mouse events --------------------------------------------
var rbtnDown, rbShift, mbtnDown, lbShift, lbCtrl, mbShift, mbCtrl;
var LeftButtonClick = Properties.Panel.LeftButtonClick.split(",");
var LeftButtonDoubleClick = Properties.Panel.LeftButtonDoubleClick.split(",");
var MiddleButtonClick = Properties.Panel.MiddleButtonClick.split(",");

function on_mouse_move(x, y) {
    Buttons.OnMouseMove && Buttons.OnMouseMove(x, y);
}
function on_mouse_lbtn_down(x, y, mask) {
    Buttons.OnLbtnDown && Buttons.OnLbtnDown(x, y);
    lbShift = mask == 5 ? true : false;
    lbCtrl = mask == 9 ? true : false;
}
function on_mouse_lbtn_up(x, y) {
    Buttons.OnLbtnUp && Buttons.OnLbtnUp(x, y);
    if (Buttons.isXYinBtns && !Buttons.isXYinBtns(x, y))
        if (lbShift && !lbCtrl)
            ClickAction(LeftButtonClick[1]);
        else if (!lbShift && lbCtrl)
            ClickAction(LeftButtonClick[2]);
        else
            ClickAction(LeftButtonClick[0]);
}
function on_mouse_lbtn_dblclk(x, y) {
    if (Buttons.isXYinBtns && !Buttons.isXYinBtns(x, y))
        if (lbShift && !lbCtrl)
            ClickAction(LeftButtonDoubleClick[1]);
        else if (!lbShift && lbCtrl)
            ClickAction(LeftButtonDoubleClick[2]);
        else
            ClickAction(LeftButtonDoubleClick[0]);
}
function on_mouse_leave() {
    Buttons.OnMouseLeave && Buttons.OnMouseLeave();
}
function on_mouse_rbtn_down(x, y, vkey) {
    rbtnDown = true;
    rbShift = vkey == 6 ? true : false;
}
function on_mouse_rbtn_up(x, y, vkey) {
    if (!rbtnDown) return true;
    rbtnDown = false;
    if (rbShift)
        return; 		// If shift key was pressed down, show default right click menu.
    else {
        FuncMenu.Show(x, y); 		// Show customize menu.
        return true; 		// Disable default right click menu.
    }
}
function on_mouse_mbtn_down(x, y, mask) {
    mbtnDown = true;
    mbShift = mask == 20 ? true : false;
    mbCtrl = mask == 24 ? true : false;
}
function on_mouse_mbtn_up(x, y) {
    if (!mbtnDown) return;
    if (mbShift && !mbCtrl)
        ClickAction(MiddleButtonClick[1]);
    else if (!mbShift && mbCtrl)
        ClickAction(MiddleButtonClick[2]);
    else
        ClickAction(MiddleButtonClick[0]);
    mbtnDown = false;
}
function on_mouse_wheel(delta) {
    if (delta > 0)
        Controller && Controller.Previous();
    else
        Controller && Controller.Next();
}
//---------------------------------------------------------
function on_timer(id) {
    Controller.OnTimer && Controller.OnTimer(id);
    Display.OnTimer && Display.OnTimer(id);
    Buttons.OnTimer && Buttons.OnTimer(id);
    DeleteTimer && (id == DeleteTimer.ID) && DeleteReservedImage();
}

//EOF