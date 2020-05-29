/**
 * @author Jiacheng Pan <jackieanxis@gmail.com>
 * @description Provide the entrance of NetV.js.
 * @dependences interfaces.ts, utils/map2.js, node.ts, link.ts
 */

import * as interfaces from './interfaces'
import Map2 from './utils/map2'
import Node from './node'
import Link from './link'
import { defaultConfigs } from './utils/configs'
import * as dataset from './dataset'

class NetV implements interfaces.Core {
    public $_id2node = new Map()
    public $_ends2link = new Map2()
    public $_container = null
    public $_configs = defaultConfigs

    private $_data: interfaces.NodeLinkData = { nodes: [], links: [] }

    /**
     * @description create NetV object.
     * @param container where you draw your graph, neccesary for NetV.
     */
    public constructor(container: HTMLDivElement) {
        if (!container || container.tagName !== 'DIV') {
            throw Error('Container should be specified as a div element!')
        }
        this.$_container = container
    }

    /**
     * @description data getter setter
     * @param nodeLinkData? the node-link-data of a graph, provided?setter:getter;
     */
    public data(nodeLinkData?: interfaces.NodeLinkData) {
        if (nodeLinkData === undefined) {
            return this.$_data
        } else {
            this.$_data = nodeLinkData
            nodeLinkData.nodes.forEach((node) => {
                this.addNode(node)
            })
            nodeLinkData.links.forEach((link) => {
                this.addLink(link)
            })
        }
    }

    /**
     * @description initilize and add a node
     * @param nodeData the data of a node, include id, styles...
     */
    public addNode(nodeData: interfaces.NodeData) {
        nodeData.id = nodeData.id.toString()
        const node = new Node(this, nodeData)
        return node
    }

    /**
     * @description initilize and add a link
     * @param linkData the data of a link, include source, target, and styles...
     */
    public addLink(linkData: interfaces.LinkData) {
        linkData.source = linkData.source.toString()
        linkData.target = linkData.target.toString()

        const link = new Link(this, linkData)
        return link
    }

    /**
     * @description get a Node object from the id2node Map data structure
     * @param id node id
     */
    public getNodeById(id: string) {
        return this.$_id2node.get(id)
    }

    /**
     * @description get a Link object from the ends2link Map2 data structure
     * @param endId1 one end id of the link (source or target)
     * @param endId2 another end id of the link (source or target)
     */
    public getLinkByEnds(endId1, endId2) {
        return this.$_ends2link.get([endId1, endId2])
    }

    /**
     * @description return build-in dataset according to name
     * @param name dataset name
     */
    public loadDataset(name: string) {
        if (name in dataset) return dataset[name]

        console.error(`NetV does not have build-in dataset: ${name}`)
        return { nodes: [], links: [] }
    }
}

export default NetV
