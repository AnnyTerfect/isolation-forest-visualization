// Description: Isolation Forest

class IsolationForest {
  constructor(numTrees, subsampleSize, maxDepth) {
    this.numTrees = numTrees // 孤立森林中的树的数量
    this.subsampleSize = subsampleSize // 随机子样本的大小
    this.maxDepth = maxDepth // 树的最大深度
    this.trees = [] // 保存所有构建的树
  }

  fit(data) {
    // 构建孤立森林
    for (let i = 0; i < this.numTrees; i++) {
      const subsample = this.getRandomSubsample(data)
      const tree = this.constructTree(subsample, 0)
      this.trees.push(tree)
    }
  }

  getRandomSubsample(data) {
    // 从数据中随机选择子样本
    if (this.subsampleSize >= data.length) {
      return data
    }
    else {
      const subsample = []
      const usedIndexes = new Set()

      while (subsample.length < this.subsampleSize) {
        const randomIndex = Math.floor(Math.random() * data.length)
        if (!usedIndexes.has(randomIndex)) {
          subsample.push(data[randomIndex])
          usedIndexes.add(randomIndex)
        }
      }

      return subsample
    }
  }

  constructTree(data, depth) {
    if (depth >= this.maxDepth || data.length <= 1) {
      // 达到最大深度或数据量为1时，返回叶子节点
      return {
        isLeaf: true,
        size: data.length,
      }
    }
    else {
      const featureIndex = Math.floor(Math.random() * data[0].length)
      const featureValues = data.map(row => row[featureIndex])

      const minValue = Math.min(...featureValues)
      const maxValue = Math.max(...featureValues)
      const splitValue = minValue + Math.random() * (maxValue - minValue)

      const leftData = []
      const rightData = []

      for (let i = 0; i < data.length; i++) {
        if (data[i][featureIndex] < splitValue)
          leftData.push(data[i])
        else
          rightData.push(data[i])
      }

      return {
        isLeaf: false,
        featureIndex,
        splitValue,
        leftChild: this.constructTree(leftData, depth + 1),
        rightChild: this.constructTree(rightData, depth + 1),
      }
    }
  }

  predict(data) {
    const lengths = []

    for (let i = 0; i < data.length; i++) {
      const instance = data[i]
      let avgPathLength = 0

      for (let j = 0; j < this.numTrees; j++) {
        const tree = this.trees[j]
        avgPathLength += this.calculatePathLength(instance, tree, 0)
      }

      avgPathLength /= this.numTrees
      lengths.push(avgPathLength)
    }

    return lengths
  }

  anomalyScore(data) {
    // 计算异常得分
    const scores = []

    for (let i = 0; i < data.length; i++) {
      const instance = data[i]
      let avgPathLength = 0

      for (let j = 0; j < this.numTrees; j++) {
        const tree = this.trees[j]
        avgPathLength += this.calculatePathLength(instance, tree, 0)
      }

      avgPathLength /= this.numTrees
      const score = 2 ** (-avgPathLength / this.calculateAveragePathLength(tree, 0))
      scores.push(score)
    }

    return scores
  }

  calculatePathLength(instance, tree, pathLength) {
    if (tree.isLeaf) {
      return pathLength + this.calculateC(tree.size)
    }
    else {
      const featureValue = instance[tree.featureIndex]
      if (featureValue < tree.splitValue)
        return this.calculatePathLength(instance, tree.leftChild, pathLength + 1)
      else
        return this.calculatePathLength(instance, tree.rightChild, pathLength + 1)
    }
  }

  calculateAveragePathLength(tree, pathLength) {
    if (tree.isLeaf) {
      return pathLength + this.calculateC(tree.size)
    }
    else {
      return (
        this.calculateAveragePathLength(tree.leftChild, pathLength + 1)
        + this.calculateAveragePathLength(tree.rightChild, pathLength + 1)
      )
    }
  }

  calculateC(size) {
    if (size > 2)
      return 2 * (Math.log(size - 1) + 0.5772156649) - (2 * (size - 1)) / size
    else if (size === 2)
      return 1
    else
      return 0
  }
}

export default IsolationForest
