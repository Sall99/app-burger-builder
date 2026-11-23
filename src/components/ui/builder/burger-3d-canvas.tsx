'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Box, Eye, Layers, Pause, Play, RotateCcw } from 'lucide-react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export interface BurgerLayerItem {
    id: string
    type: string
}

interface Burger3DCanvasProps {
    layers: BurgerLayerItem[]
    isFr: boolean
}

interface LayerMeta {
    nameFr: string
    nameEn: string
    kcal: number
    thickness: number
}

const LAYER_META: Record<string, LayerMeta> = {
    BreadBottom: {
        nameFr: 'Pain brioché (base)',
        nameEn: 'Brioche bottom bun',
        kcal: 130,
        thickness: 0.34
    },
    meat: {
        nameFr: 'Steak de bœuf smashé',
        nameEn: 'Smashed beef patty',
        kcal: 250,
        thickness: 0.28
    },
    cheese: {
        nameFr: 'Cheddar affiné fondant',
        nameEn: 'Melted aged cheddar',
        kcal: 110,
        thickness: 0.08
    },
    bacon: {
        nameFr: 'Bacon fumé croustillant',
        nameEn: 'Crispy smoked bacon',
        kcal: 120,
        thickness: 0.14
    },
    salad: {
        nameFr: 'Laitue fraîche croquante',
        nameEn: 'Crisp butterhead lettuce',
        kcal: 15,
        thickness: 0.16
    },
    BreadTop: {
        nameFr: 'Pain brioché doré au sésame',
        nameEn: 'Sesame brioche crown',
        kcal: 150,
        thickness: 0.62
    }
}

// Deterministic 3D hash & smooth value noise for organic food geometry
function hash3(x: number, y: number, z: number): number {
    const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123
    return h - Math.floor(h)
}

function noise3(x: number, y: number, z: number): number {
    const ix = Math.floor(x)
    const iy = Math.floor(y)
    const iz = Math.floor(z)
    const fx = x - ix
    const fy = y - iy
    const fz = z - iz
    const ux = fx * fx * (3 - 2 * fx)
    const uy = fy * fy * (3 - 2 * fy)
    const uz = fz * fz * (3 - 2 * fz)

    const n000 = hash3(ix, iy, iz)
    const n100 = hash3(ix + 1, iy, iz)
    const n010 = hash3(ix, iy + 1, iz)
    const n110 = hash3(ix + 1, iy + 1, iz)
    const n001 = hash3(ix, iy, iz + 1)
    const n101 = hash3(ix + 1, iy, iz + 1)
    const n011 = hash3(ix, iy + 1, iz + 1)
    const n111 = hash3(ix + 1, iy + 1, iz + 1)

    const nx00 = n000 + (n100 - n000) * ux
    const nx10 = n010 + (n110 - n010) * ux
    const nx01 = n001 + (n101 - n001) * ux
    const nx11 = n011 + (n111 - n011) * ux

    const nxy0 = nx00 + (nx10 - nx00) * uy
    const nxy1 = nx01 + (nx11 - nx01) * uy

    return nxy0 + (nxy1 - nxy0) * uz
}

function fbm3(x: number, y: number, z: number): number {
    return (
        0.55 * noise3(x, y, z) +
        0.3 * noise3(x * 2.1, y * 2.1, z * 2.1) +
        0.15 * noise3(x * 4.3, y * 4.3, z * 4.3)
    )
}

interface CachedTextures {
    bunTopColor: THREE.CanvasTexture
    bunBump: THREE.CanvasTexture
    crumbColor: THREE.CanvasTexture
    meatColor: THREE.CanvasTexture
    meatBump: THREE.CanvasTexture
    cheeseBump: THREE.CanvasTexture
    baconColor: THREE.CanvasTexture
    saladColor: THREE.CanvasTexture
}

let cachedTextures: CachedTextures | null = null

function getProceduralTextures(): CachedTextures {
    if (cachedTextures) return cachedTextures

    // 1. Brioche top crust texture
    const bunCanvas = document.createElement('canvas')
    bunCanvas.width = 512
    bunCanvas.height = 512
    const bCtx = bunCanvas.getContext('2d')!
    const bGrad = bCtx.createLinearGradient(0, 0, 0, 512)
    bGrad.addColorStop(0, '#B85414')
    bGrad.addColorStop(0.28, '#D67422')
    bGrad.addColorStop(0.68, '#E89B42')
    bGrad.addColorStop(0.88, '#F6CE86')
    bGrad.addColorStop(1, '#DF9A48')
    bCtx.fillStyle = bGrad
    bCtx.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 4500; i++) {
        const x = Math.random() * 512
        const y = Math.random() * 512
        const r = 0.8 + Math.random() * 2.2
        bCtx.fillStyle =
            Math.random() > 0.5 ? 'rgba(255,235,190,0.08)' : 'rgba(110,42,8,0.08)'
        bCtx.beginPath()
        bCtx.arc(x, y, r, 0, Math.PI * 2)
        bCtx.fill()
    }
    const bunTopColor = new THREE.CanvasTexture(bunCanvas)
    bunTopColor.colorSpace = THREE.SRGBColorSpace

    // 2. Soft bread bump map
    const bunBumpCanvas = document.createElement('canvas')
    bunBumpCanvas.width = 256
    bunBumpCanvas.height = 256
    const bbCtx = bunBumpCanvas.getContext('2d')!
    bbCtx.fillStyle = '#808080'
    bbCtx.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 3500; i++) {
        const v = Math.floor(100 + Math.random() * 55)
        bbCtx.fillStyle = `rgb(${v},${v},${v})`
        bbCtx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2)
    }
    const bunBump = new THREE.CanvasTexture(bunBumpCanvas)

    // 3. Toasted interior brioche crumb
    const crumbCanvas = document.createElement('canvas')
    crumbCanvas.width = 512
    crumbCanvas.height = 512
    const cCtx = crumbCanvas.getContext('2d')!
    const cGrad = cCtx.createRadialGradient(256, 256, 20, 256, 256, 250)
    cGrad.addColorStop(0, '#FCE4AE')
    cGrad.addColorStop(0.65, '#F2C574')
    cGrad.addColorStop(0.88, '#C97224')
    cGrad.addColorStop(1, '#9A4812')
    cCtx.fillStyle = cGrad
    cCtx.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512
        const y = Math.random() * 512
        cCtx.fillStyle =
            Math.random() > 0.45 ? 'rgba(130,58,14,0.14)' : 'rgba(255,248,225,0.18)'
        cCtx.beginPath()
        cCtx.arc(x, y, 1 + Math.random() * 2.4, 0, Math.PI * 2)
        cCtx.fill()
    }
    const crumbColor = new THREE.CanvasTexture(crumbCanvas)
    crumbColor.colorSpace = THREE.SRGBColorSpace

    // 4. Seared smash beef patty texture + bump
    const meatCanvas = document.createElement('canvas')
    meatCanvas.width = 512
    meatCanvas.height = 512
    const mCtx = meatCanvas.getContext('2d')!
    mCtx.fillStyle = '#4A1F0D'
    mCtx.fillRect(0, 0, 512, 512)

    const meatBumpCanvas = document.createElement('canvas')
    meatBumpCanvas.width = 512
    meatBumpCanvas.height = 512
    const mbCtx = meatBumpCanvas.getContext('2d')!
    mbCtx.fillStyle = '#808080'
    mbCtx.fillRect(0, 0, 512, 512)

    for (let i = 0; i < 7500; i++) {
        const x = Math.random() * 512
        const y = Math.random() * 512
        const radius = 1.5 + Math.random() * 4.5
        const rnd = Math.random()
        if (rnd < 0.3) {
            mCtx.fillStyle = 'rgba(28, 9, 3, 0.48)'
            mbCtx.fillStyle = 'rgba(40, 40, 40, 0.45)'
        } else if (rnd < 0.65) {
            mCtx.fillStyle = 'rgba(108, 49, 23, 0.38)'
            mbCtx.fillStyle = 'rgba(215, 215, 215, 0.4)'
        } else {
            mCtx.fillStyle = 'rgba(148, 76, 40, 0.25)'
            mbCtx.fillStyle = 'rgba(245, 245, 245, 0.35)'
        }
        mCtx.beginPath()
        mCtx.arc(x, y, radius, 0, Math.PI * 2)
        mCtx.fill()

        mbCtx.beginPath()
        mbCtx.arc(x, y, radius, 0, Math.PI * 2)
        mbCtx.fill()
    }
    // Subtle char grill marks
    mCtx.strokeStyle = 'rgba(20, 6, 2, 0.45)'
    mCtx.lineWidth = 14
    for (let gx = 80; gx < 460; gx += 75) {
        mCtx.beginPath()
        mCtx.moveTo(gx, 30)
        mCtx.lineTo(gx + 35, 480)
        mCtx.stroke()
    }
    const meatColor = new THREE.CanvasTexture(meatCanvas)
    meatColor.colorSpace = THREE.SRGBColorSpace
    const meatBump = new THREE.CanvasTexture(meatBumpCanvas)

    // 5. Cheese subtle micro-bump
    const cheeseBumpCanvas = document.createElement('canvas')
    cheeseBumpCanvas.width = 256
    cheeseBumpCanvas.height = 256
    const cbCtx = cheeseBumpCanvas.getContext('2d')!
    cbCtx.fillStyle = '#808080'
    cbCtx.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 600; i++) {
        cbCtx.fillStyle = 'rgba(200,200,200,0.18)'
        cbCtx.beginPath()
        cbCtx.arc(Math.random() * 256, Math.random() * 256, 2 + Math.random() * 5, 0, Math.PI * 2)
        cbCtx.fill()
    }
    const cheeseBump = new THREE.CanvasTexture(cheeseBumpCanvas)

    // 6. Streaky smoked bacon texture
    const baconCanvas = document.createElement('canvas')
    baconCanvas.width = 512
    baconCanvas.height = 256
    const baCtx = baconCanvas.getContext('2d')!
    baCtx.fillStyle = '#7A1C14'
    baCtx.fillRect(0, 0, 512, 256)
    const stripes = [
        { y: 18, h: 36, color: '#58110B' },
        { y: 58, h: 34, color: '#F3C79E' },
        { y: 96, h: 56, color: '#8F2418' },
        { y: 156, h: 32, color: '#FADAB8' },
        { y: 192, h: 48, color: '#61130C' }
    ]
    for (const s of stripes) {
        baCtx.fillStyle = s.color
        baCtx.beginPath()
        baCtx.moveTo(0, s.y)
        for (let x = 0; x <= 512; x += 16) {
            baCtx.lineTo(x, s.y + Math.sin(x * 0.04) * 5)
        }
        for (let x = 512; x >= 0; x -= 16) {
            baCtx.lineTo(x, s.y + s.h + Math.sin(x * 0.04) * 5)
        }
        baCtx.closePath()
        baCtx.fill()
    }
    for (let i = 0; i < 2500; i++) {
        baCtx.fillStyle =
            Math.random() > 0.5 ? 'rgba(35,6,3,0.18)' : 'rgba(255,220,180,0.12)'
        baCtx.fillRect(Math.random() * 512, Math.random() * 256, 3, 2)
    }
    const baconColor = new THREE.CanvasTexture(baconCanvas)
    baconColor.colorSpace = THREE.SRGBColorSpace

    // 7. Fresh butterhead lettuce leaf veins texture
    const saladCanvas = document.createElement('canvas')
    saladCanvas.width = 512
    saladCanvas.height = 512
    const sCtx = saladCanvas.getContext('2d')!
    const sGrad = sCtx.createRadialGradient(256, 256, 15, 256, 256, 256)
    sGrad.addColorStop(0, '#D9F99D')
    sGrad.addColorStop(0.32, '#84CC16')
    sGrad.addColorStop(0.75, '#4D7C0F')
    sGrad.addColorStop(1, '#65A30D')
    sCtx.fillStyle = sGrad
    sCtx.fillRect(0, 0, 512, 512)
    sCtx.strokeStyle = 'rgba(236, 252, 203, 0.42)'
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 14) {
        sCtx.lineWidth = 2.5
        sCtx.beginPath()
        sCtx.moveTo(256, 256)
        const ex = 256 + Math.cos(a) * 240
        const ey = 256 + Math.sin(a) * 240
        sCtx.quadraticCurveTo(
            256 + Math.cos(a + 0.12) * 120,
            256 + Math.sin(a + 0.12) * 120,
            ex,
            ey
        )
        sCtx.stroke()
    }
    const saladColor = new THREE.CanvasTexture(saladCanvas)
    saladColor.colorSpace = THREE.SRGBColorSpace

    cachedTextures = {
        bunTopColor,
        bunBump,
        crumbColor,
        meatColor,
        meatBump,
        cheeseBump,
        baconColor,
        saladColor
    }
    return cachedTextures
}

function createTopBunGroup(tex: CachedTextures): THREE.Group {
    const group = new THREE.Group()

    // Sculpted brioche dome profile via LatheGeometry
    const points: THREE.Vector2[] = []
    const steps = 28
    const radius = 1.28
    const height = 0.72
    points.push(new THREE.Vector2(0, 0))
    points.push(new THREE.Vector2(radius * 0.94, 0))
    for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const angle = t * (Math.PI / 2)
        const r = Math.cos(angle) * radius * (1 + 0.04 * Math.sin(t * Math.PI))
        const y = Math.sin(angle) * height
        points.push(new THREE.Vector2(Math.max(0, r), y))
    }

    const geom = new THREE.LatheGeometry(points, 64)
    const pos = geom.attributes.position
    for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i)
        const vy = pos.getY(i)
        const vz = pos.getZ(i)
        if (vy > 0.02) {
            const n = (fbm3(vx * 1.8, vy * 1.8, vz * 1.8) - 0.5) * 0.045
            pos.setXYZ(i, vx * (1 + n), vy * (1 + n * 0.6), vz * (1 + n))
        }
    }
    geom.computeVertexNormals()

    const mat = new THREE.MeshPhysicalMaterial({
        map: tex.bunTopColor,
        bumpMap: tex.bunBump,
        bumpScale: 0.012,
        roughness: 0.32,
        metalness: 0.02,
        clearcoat: 0.42,
        clearcoatRoughness: 0.24
    })

    const bunMesh = new THREE.Mesh(geom, mat)
    bunMesh.castShadow = true
    bunMesh.receiveShadow = true
    group.add(bunMesh)

    // 95 3D Toasted Sesame Seeds distributed on the dome via Fibonacci spiral
    const seedCount = 95
    const seedGeom = new THREE.SphereGeometry(0.036, 10, 8)
    seedGeom.scale(0.85, 0.42, 1.55)
    const seedMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFF6D6'),
        roughness: 0.38,
        metalness: 0.02
    })
    const seedsMesh = new THREE.InstancedMesh(seedGeom, seedMat, seedCount)
    seedsMesh.castShadow = true

    const dummy = new THREE.Object3D()
    const up = new THREE.Vector3(0, 1, 0)
    const normal = new THREE.Vector3()
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < seedCount; i++) {
        const t = (i + 0.5) / seedCount
        const phi = Math.acos(1 - t * 0.72) // upper 72% of dome
        const theta = i * goldenAngle

        const sinPhi = Math.sin(phi)
        const cosPhi = Math.cos(phi)
        const sx = Math.cos(theta) * sinPhi * radius * 0.99
        const sz = Math.sin(theta) * sinPhi * radius * 0.99
        const sy = cosPhi * height * 0.99

        dummy.position.set(sx, sy, sz)
        normal.set(sx / (radius * radius), sy / (height * height), sz / (radius * radius)).normalize()
        dummy.quaternion.setFromUnitVectors(up, normal)
        dummy.rotateY((i * 1.7) % (Math.PI * 2))
        dummy.updateMatrix()
        seedsMesh.setMatrixAt(i, dummy.matrix)
    }
    seedsMesh.instanceMatrix.needsUpdate = true
    group.add(seedsMesh)

    return group
}

function createBottomBunGroup(tex: CachedTextures): THREE.Group {
    const group = new THREE.Group()
    const radius = 1.25
    const height = 0.34

    const points: THREE.Vector2[] = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(radius * 0.84, 0),
        new THREE.Vector2(radius * 0.95, height * 0.22),
        new THREE.Vector2(radius, height * 0.62),
        new THREE.Vector2(radius * 0.97, height),
        new THREE.Vector2(0, height)
    ]

    const geom = new THREE.LatheGeometry(points, 64)
    const pos = geom.attributes.position
    for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i)
        const vy = pos.getY(i)
        const vz = pos.getZ(i)
        const n = (fbm3(vx * 2.1, vy * 2.1, vz * 2.1) - 0.5) * 0.035
        pos.setXYZ(i, vx * (1 + n), vy, vz * (1 + n))
    }
    geom.computeVertexNormals()

    const crustMat = new THREE.MeshPhysicalMaterial({
        map: tex.bunTopColor,
        bumpMap: tex.bunBump,
        bumpScale: 0.012,
        roughness: 0.38,
        clearcoat: 0.25,
        clearcoatRoughness: 0.32
    })
    const mesh = new THREE.Mesh(geom, crustMat)
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)

    // Toasted interior top face
    const topDiscGeom = new THREE.CircleGeometry(radius * 0.95, 48)
    topDiscGeom.rotateX(-Math.PI / 2)
    topDiscGeom.translate(0, height + 0.003, 0)
    const crumbMat = new THREE.MeshStandardMaterial({
        map: tex.crumbColor,
        bumpMap: tex.bunBump,
        bumpScale: 0.018,
        roughness: 0.65
    })
    const topDisc = new THREE.Mesh(topDiscGeom, crumbMat)
    topDisc.receiveShadow = true
    group.add(topDisc)

    return group
}

function createMeatGroup(tex: CachedTextures, seedOffset: number): THREE.Group {
    const group = new THREE.Group()
    const radius = 1.3
    const height = 0.28

    const geom = new THREE.CylinderGeometry(radius * 0.98, radius, height, 68, 12)
    geom.translate(0, height / 2, 0)

    const pos = geom.attributes.position
    for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i)
        const vy = pos.getY(i)
        const vz = pos.getZ(i)
        const dist = Math.sqrt(vx * vx + vz * vz)
        const angle = Math.atan2(vz, vx)

        // Bevel top/bottom rim + craggy hand-smashed perimeter
        const normalizedY = (vy / height) * 2 - 1 // -1..1
        const rimProfile = Math.sqrt(Math.max(0.15, 1 - Math.pow(normalizedY * 0.85, 4)))
        const n = fbm3(vx * 2.6 + seedOffset, vy * 3.2, vz * 2.6 + seedOffset) - 0.5
        const edgeCrag =
            Math.sin(angle * 11 + seedOffset) * 0.025 + Math.cos(angle * 19 - seedOffset) * 0.018

        if (dist > 0.05) {
            const radialScale = rimProfile * (1 + n * 0.16 + edgeCrag)
            pos.setX(i, vx * radialScale)
            pos.setZ(i, vz * radialScale)
        }
        pos.setY(i, vy + n * 0.04)
    }
    geom.computeVertexNormals()

    const mat = new THREE.MeshPhysicalMaterial({
        map: tex.meatColor,
        bumpMap: tex.meatBump,
        bumpScale: 0.042,
        roughness: 0.42,
        metalness: 0.04,
        clearcoat: 0.24,
        clearcoatRoughness: 0.28
    })

    const mesh = new THREE.Mesh(geom, mat)
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)

    return group
}

function createCheeseGroup(tex: CachedTextures, seedOffset: number): THREE.Group {
    const group = new THREE.Group()
    const size = 2.08
    const segs = 44
    const geom = new THREE.PlaneGeometry(size, size, segs, segs)
    geom.rotateX(-Math.PI / 2)

    const pos = geom.attributes.position
    for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i)
        const vz = pos.getZ(i)
        const r = Math.sqrt(vx * vx + vz * vz)

        // Smooth gravity droop on the 4 corners overhanging the patty
        let droop = 0
        if (r > 0.96) {
            const excess = r - 0.96
            droop = -Math.pow(excess, 1.55) * 0.52
        }
        const wave = (fbm3(vx * 2 + seedOffset, 0, vz * 2 + seedOffset) - 0.5) * 0.03
        pos.setY(i, 0.045 + droop + wave)
    }
    geom.computeVertexNormals()

    const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#FFA800'),
        emissive: new THREE.Color('#3B1D00'),
        emissiveIntensity: 0.08,
        bumpMap: tex.cheeseBump,
        bumpScale: 0.008,
        roughness: 0.2,
        metalness: 0.01,
        clearcoat: 0.52,
        clearcoatRoughness: 0.16,
        side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(geom, mat)
    mesh.rotation.y = seedOffset * 0.75 + Math.PI / 7
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)

    return group
}

function createBaconGroup(tex: CachedTextures, seedOffset: number): THREE.Group {
    const group = new THREE.Group()

    const mat = new THREE.MeshPhysicalMaterial({
        map: tex.baconColor,
        bumpMap: tex.meatBump,
        bumpScale: 0.018,
        roughness: 0.32,
        metalness: 0.02,
        clearcoat: 0.36,
        clearcoatRoughness: 0.22
    })

    const stripOffsets = [-0.52, 0, 0.52]
    stripOffsets.forEach((zOff, idx) => {
        const geom = new THREE.BoxGeometry(2.42, 0.055, 0.44, 48, 2, 10)
        const pos = geom.attributes.position
        for (let i = 0; i < pos.count; i++) {
            const vx = pos.getX(i)
            const vy = pos.getY(i)
            const vz = pos.getZ(i)
            const wave =
                Math.sin(vx * 4.4 + idx * 1.4 + seedOffset) * 0.055 +
                Math.cos(vx * 8.2 - idx) * 0.022
            const curl = Math.pow(vz / 0.22, 2) * 0.025
            pos.setY(i, vy + wave + curl + 0.05)
        }
        geom.computeVertexNormals()

        const strip = new THREE.Mesh(geom, mat)
        strip.position.z = zOff
        strip.rotation.y = (idx - 1) * 0.14 + (seedOffset % 0.4)
        strip.castShadow = true
        strip.receiveShadow = true
        group.add(strip)
    })

    return group
}

function createSaladGroup(tex: CachedTextures, seedOffset: number): THREE.Group {
    const group = new THREE.Group()
    const radius = 1.36
    const geom = new THREE.CylinderGeometry(radius, radius * 0.92, 0.07, 72, 3)
    geom.translate(0, 0.06, 0)

    const pos = geom.attributes.position
    for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i)
        const vy = pos.getY(i)
        const vz = pos.getZ(i)
        const r = Math.sqrt(vx * vx + vz * vz)
        const angle = Math.atan2(vz, vx)
        const normR = r / radius

        const ruffle =
            Math.pow(normR, 1.35) *
            (Math.sin(angle * 7 + seedOffset) * 0.11 +
                Math.cos(angle * 13 - seedOffset) * 0.055 +
                Math.sin(angle * 19 + seedOffset) * 0.025)
        const radialFlutter = 1 + Math.pow(normR, 2) * Math.sin(angle * 9 + seedOffset) * 0.06

        pos.setX(i, vx * radialFlutter)
        pos.setZ(i, vz * radialFlutter)
        pos.setY(i, vy + ruffle)
    }
    geom.computeVertexNormals()

    const mat = new THREE.MeshPhysicalMaterial({
        map: tex.saladColor,
        bumpMap: tex.bunBump,
        bumpScale: 0.012,
        roughness: 0.44,
        metalness: 0.01,
        clearcoat: 0.18,
        clearcoatRoughness: 0.35
    })

    const mesh = new THREE.Mesh(geom, mat)
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)

    return group
}

function buildLayerObject(type: string, tex: CachedTextures, index: number): THREE.Group {
    switch (type) {
        case 'BreadTop':
            return createTopBunGroup(tex)
        case 'BreadBottom':
            return createBottomBunGroup(tex)
        case 'meat':
            return createMeatGroup(tex, index * 2.3 + 1.1)
        case 'cheese':
            return createCheeseGroup(tex, index * 1.9 + 0.7)
        case 'bacon':
            return createBaconGroup(tex, index * 3.1 + 0.4)
        case 'salad':
            return createSaladGroup(tex, index * 2.7 + 1.5)
        default:
            return new THREE.Group()
    }
}

interface ManagedLayer3D {
    id: string
    type: string
    group: THREE.Group
    currentY: number
    targetY: number
    velocityY: number
    currentScale: number
}

export const Burger3DCanvas: React.FC<Burger3DCanvasProps> = ({ layers, isFr }) => {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [exploded, setExploded] = useState(false)
    const [autoRotate, setAutoRotate] = useState(true)
    const [hoveredLayer, setHoveredLayer] = useState<{
        type: string
        index: number
        total: number
    } | null>(null)

    const explodedRef = useRef(exploded)
    explodedRef.current = exploded

    const autoRotateRef = useRef(autoRotate)
    autoRotateRef.current = autoRotate

    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const controlsRef = useRef<OrbitControls | null>(null)
    const burgerRootRef = useRef<THREE.Group | null>(null)
    const managedLayersRef = useRef<Map<string, ManagedLayer3D>>(new Map())

    // Initialize WebGL Scene once
    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const managedMap = managedLayersRef.current

        const width = container.clientWidth || 460
        const height = container.clientHeight || 400

        const scene = new THREE.Scene()
        sceneRef.current = scene

        const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100)
        camera.position.set(0, 2.35, 5.8)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        })
        renderer.setSize(width, height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.12
        renderer.outputColorSpace = THREE.SRGBColorSpace

        container.innerHTML = ''
        container.appendChild(renderer.domElement)

        // Studio Lighting
        const hemiLight = new THREE.HemisphereLight('#FFFDF8', '#D6C5B3', 1.15)
        hemiLight.position.set(0, 8, 0)
        scene.add(hemiLight)

        const keyLight = new THREE.DirectionalLight('#FFF7EA', 2.2)
        keyLight.position.set(3.8, 6.5, 4.2)
        keyLight.castShadow = true
        keyLight.shadow.mapSize.width = 1024
        keyLight.shadow.mapSize.height = 1024
        keyLight.shadow.camera.near = 1
        keyLight.shadow.camera.far = 16
        const d = 3.2
        keyLight.shadow.camera.left = -d
        keyLight.shadow.camera.right = d
        keyLight.shadow.camera.top = d
        keyLight.shadow.camera.bottom = -d
        keyLight.shadow.bias = -0.0008
        scene.add(keyLight)

        const rimLight = new THREE.DirectionalLight('#FFE5C4', 1.25)
        rimLight.position.set(-4.5, 4.2, -3.5)
        scene.add(rimLight)

        const frontFill = new THREE.DirectionalLight('#FFFFFF', 0.55)
        frontFill.position.set(0, 1.5, 5)
        scene.add(frontFill)

        // Serving Platter Pedestal
        const platterGroup = new THREE.Group()
        const platterGeom = new THREE.CylinderGeometry(1.75, 1.58, 0.11, 64)
        platterGeom.translate(0, -0.055, 0)
        const platterMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#231F1C'),
            roughness: 0.45,
            metalness: 0.08
        })
        const platterMesh = new THREE.Mesh(platterGeom, platterMat)
        platterMesh.receiveShadow = true
        platterMesh.castShadow = true
        platterGroup.add(platterMesh)

        const rimGeom = new THREE.TorusGeometry(1.72, 0.035, 16, 64)
        rimGeom.rotateX(Math.PI / 2)
        const rimMesh = new THREE.Mesh(rimGeom, platterMat)
        rimMesh.receiveShadow = true
        platterGroup.add(rimMesh)

        scene.add(platterGroup)

        const burgerRoot = new THREE.Group()
        scene.add(burgerRoot)
        burgerRootRef.current = burgerRoot

        // Orbit Controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.06
        controls.enablePan = false
        controls.minDistance = 3.6
        controls.maxDistance = 8.5
        controls.minPolarAngle = 0.25
        controls.maxPolarAngle = Math.PI / 2 - 0.04
        controls.target.set(0, 0.9, 0)
        controls.autoRotate = autoRotateRef.current
        controls.autoRotateSpeed = 1.6
        controlsRef.current = controls

        // Raycaster for hover inspection
        const raycaster = new THREE.Raycaster()
        const pointer = new THREE.Vector2(-99, -99)

        const onPointerMove = (e: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect()
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

            raycaster.setFromCamera(pointer, camera)
            const hits = raycaster.intersectObjects(burgerRoot.children, true)
            if (hits.length > 0) {
                let obj: THREE.Object3D | null = hits[0].object
                while (obj && obj.parent !== burgerRoot) {
                    obj = obj.parent
                }
                if (obj && obj.userData?.layerType) {
                    setHoveredLayer({
                        type: obj.userData.layerType,
                        index: obj.userData.layerIndex,
                        total: obj.userData.totalLayers
                    })
                    return
                }
            }
            setHoveredLayer(null)
        }

        const onPointerLeave = () => setHoveredLayer(null)

        renderer.domElement.addEventListener('pointermove', onPointerMove)
        renderer.domElement.addEventListener('pointerleave', onPointerLeave)

        // Resize observer
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const w = entry.contentRect.width
                const h = entry.contentRect.height
                if (w > 0 && h > 0) {
                    camera.aspect = w / h
                    camera.updateProjectionMatrix()
                    renderer.setSize(w, h)
                }
            }
        })
        ro.observe(container)

        // Physics & render loop
        let frameId = 0
        let lastTime = performance.now()

        const animate = (now: number) => {
            frameId = requestAnimationFrame(animate)
            const dt = Math.min(0.05, (now - lastTime) / 1000)
            lastTime = now

            controls.autoRotate = autoRotateRef.current

            // Spring animation for every burger layer
            let maxTopY = 1.2
            managedLayersRef.current.forEach((item) => {
                const stiffness = 190
                const damping = 19
                const force = (item.targetY - item.currentY) * stiffness
                item.velocityY = (item.velocityY + force * dt) * Math.exp(-damping * dt)
                item.currentY += item.velocityY * dt
                item.group.position.y = item.currentY

                item.currentScale += (1 - item.currentScale) * Math.min(1, dt * 14)
                item.group.scale.setScalar(item.currentScale)

                if (item.currentY > maxTopY) maxTopY = item.currentY
            })

            // Smoothly keep camera target centered on the burger's vertical midpoint
            const desiredTargetY = Math.max(0.75, maxTopY * 0.48)
            controls.target.y += (desiredTargetY - controls.target.y) * Math.min(1, dt * 8)

            controls.update()
            renderer.render(scene, camera)
        }

        frameId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(frameId)
            ro.disconnect()
            renderer.domElement.removeEventListener('pointermove', onPointerMove)
            renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
            controls.dispose()
            renderer.dispose()
            managedMap.clear()
        }
    }, [])

    // Sync layers & compute stacked / exploded target Y positions
    useEffect(() => {
        const burgerRoot = burgerRootRef.current
        if (!burgerRoot) return

        const tex = getProceduralTextures()
        const existingMap = managedLayersRef.current

        // Full sequence from bottom to top: BreadBottom -> fillings (bottom-to-top) -> BreadTop
        // Note: in 2D, `layers` is ordered top-to-bottom, so we reverse fillings for 3D bottom-up stacking
        const fillingsBottomUp = [...layers].reverse()
        const fullStack: BurgerLayerItem[] = [
            { id: '__bread_bottom__', type: 'BreadBottom' },
            ...fillingsBottomUp,
            { id: '__bread_top__', type: 'BreadTop' }
        ]

        const activeIds = new Set(fullStack.map((l) => l.id))

        // Remove deleted layers
        existingMap.forEach((val, key) => {
            if (!activeIds.has(key)) {
                burgerRoot.remove(val.group)
                existingMap.delete(key)
            }
        })

        // Compute targetY for each layer in bottom-up order
        let cursorY = 0
        const gap = exploded ? 0.36 : 0

        fullStack.forEach((item, idx) => {
            const meta = LAYER_META[item.type] || LAYER_META.meat
            let managed = existingMap.get(item.id)

            if (!managed) {
                const group = buildLayerObject(item.type, tex, idx)
                const spawnY = cursorY + (item.type === 'BreadBottom' ? 0 : 1.1)
                group.position.y = spawnY
                const initialScale = item.type === 'BreadBottom' ? 1 : 0.72
                group.scale.setScalar(initialScale)
                burgerRoot.add(group)

                managed = {
                    id: item.id,
                    type: item.type,
                    group,
                    currentY: spawnY,
                    targetY: cursorY,
                    velocityY: 0,
                    currentScale: initialScale
                }
                existingMap.set(item.id, managed)
            } else {
                managed.targetY = cursorY
            }

            managed.group.userData = {
                layerType: item.type,
                layerIndex: idx + 1,
                totalLayers: fullStack.length
            }

            cursorY += meta.thickness + gap
        })
    }, [layers, exploded])

    const handleResetView = () => {
        const camera = cameraRef.current
        const controls = controlsRef.current
        if (!camera || !controls) return
        camera.position.set(0, 2.35, 5.8)
        controls.update()
    }

    const hoveredMeta = hoveredLayer ? LAYER_META[hoveredLayer.type] : null

    return (
        <div className="relative flex flex-col items-center justify-center bg-surface/40 min-h-[370px] w-full overflow-hidden">
            {/* Floating Top-Left 3D Controls */}
            <div className="absolute left-3.5 top-3.5 z-10 flex flex-wrap items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => setExploded((v) => !v)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        exploded
                            ? 'border-ink bg-ink text-white'
                            : 'border-surface-border bg-white/95 text-ink hover:bg-surface'
                    }`}>
                    <Layers size={13} />
                    <span>{isFr ? 'Vue éclatée' : 'Exploded view'}</span>
                </button>

                <button
                    type="button"
                    onClick={() => setAutoRotate((v) => !v)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        autoRotate
                            ? 'border-surface-border bg-white/95 text-ink'
                            : 'border-surface-border bg-surface text-ink-muted'
                    }`}
                    title={isFr ? 'Rotation automatique 360°' : 'Auto-rotate 360°'}>
                    {autoRotate ? <Pause size={12} /> : <Play size={12} />}
                    <span>360°</span>
                </button>

                <button
                    type="button"
                    onClick={handleResetView}
                    className="inline-flex items-center justify-center rounded-lg border border-surface-border bg-white/95 p-1.5 text-ink-muted hover:text-ink transition-colors"
                    title={isFr ? 'Réinitialiser la caméra' : 'Reset camera'}>
                    <RotateCcw size={13} />
                </button>
            </div>

            {/* Hover Layer Inspector HUD */}
            {hoveredMeta && hoveredLayer && (
                <div className="pointer-events-none absolute right-3.5 top-3.5 z-10 rounded-lg border border-surface-border bg-white/95 px-3 py-1.5 text-xs shadow-soft backdrop-blur-sm">
                    <p className="font-semibold text-ink">
                        {isFr ? hoveredMeta.nameFr : hoveredMeta.nameEn}
                    </p>
                    <p className="text-[11px] text-ink-muted tabular-nums">
                        {isFr ? 'Couche' : 'Layer'} {hoveredLayer.index}/{hoveredLayer.total} ·{' '}
                        {hoveredMeta.kcal} kcal
                    </p>
                </div>
            )}

            {/* Three.js WebGL Viewport */}
            <div
                ref={containerRef}
                className="h-[350px] w-full cursor-grab active:cursor-grabbing"
                aria-label={
                    isFr
                        ? 'Aperçu 3D interactif du burger à 360 degrés'
                        : 'Interactive 360-degree 3D burger preview'
                }
            />

            {/* Bottom Hint */}
            <p className="pb-3 inline-flex items-center gap-1.5 text-[11px] text-ink-subtle">
                <Box size={12} />
                <span>
                    {isFr
                        ? 'Faites pivoter à 360° · Molette pour zoomer · Survolez une couche'
                        : 'Drag to rotate 360° · Scroll to zoom · Hover any layer'}
                </span>
            </p>
        </div>
    )
}

export default Burger3DCanvas
