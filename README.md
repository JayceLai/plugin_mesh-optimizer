# Introduce

The repo is a plugin of [cocos creator 3d based on v1.1](https://www.cocos.com/products#CocosCreator3D) that used to mesh optimizer, which powered by [gltfpack](https://www.npmjs.com/package/gltfpack).

## How to use

You can just clone this repo to the folder of packages, which have two path options:

1. \${home}/packages
2. \${project}/packages

The difference:

- the path `${home}/packages` can used for all projects.

## Usage snapshot

```text
gltfpack 0.14
Usage: gltfpack [options] -i input -o output

Basics:
        -i file: input file to process, .obj/.gltf/.glb
        -o file: output file path, .gltf/.glb
        -c: produce compressed gltf/glb files (-cc for higher compression ratio)

Textures:
        -te: embed all textures into main buffer (.bin or .glb)
        -tb: convert all textures to Basis Universal format (with basisu executable); will be removed in the future
        -tc: convert all textures to KTX2 with BasisU supercompression (using basisu executable)
        -tq N: set texture encoding quality (default: 50; N should be between 1 and 100
        -tu: use UASTC when encoding textures (much higher quality and much larger size)

Simplification:
        -si R: simplify meshes to achieve the ratio R (default: 1; R should be between 0 and 1)
        -sa: aggressively simplify to the target ratio disregarding quality

Vertices:
        -vp N: use N-bit quantization for positions (default: 14; N should be between 1 and 16)
        -vt N: use N-bit quantization for texture corodinates (default: 12; N should be between 1 and 16)
        -vn N: use N-bit quantization for normals and tangents (default: 8; N should be between 1 and 16)

Animations:
        -at N: use N-bit quantization for translations (default: 16; N should be between 1 and 24)
        -ar N: use N-bit quantization for rotations (default: 12; N should be between 4 and 16)
        -as N: use N-bit quantization for scale (default: 16; N should be between 1 and 24)
        -af N: resample animations at N Hz (default: 30)
        -ac: keep constant animation tracks even if they don't modify the node transform

Scene:
        -kn: keep named nodes and meshes attached to named nodes so that named nodes can be transformed externally
        -ke: keep extras data

Miscellaneous:
        -cf: produce compressed gltf/glb files with fallback for loaders that don't support compression
        -noq: disable quantization; produces much larger glTF files with no extensions
        -v: verbose output (print version when used without other options)
        -h: display this help and exit
```
