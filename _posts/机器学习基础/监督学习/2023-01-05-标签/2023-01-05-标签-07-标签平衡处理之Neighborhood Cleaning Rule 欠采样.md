---
title: 机器学习基础-监督学习-标签平衡处理之 Neighborhood Cleaning Rule（NCR）欠采样
categories: [机器学习]
tags: [人工智能, 机器学习, 监督学习]
math: true
---

Neighborhood Cleaning Rule（NCR）欠采样是一种基于近邻的欠采样方法，它通过找到离少数类样本最近的多数类样本，并根据它们之间的距离来删除部分多数类样本，以达到类别平衡的目的。它的主要思想是在保留少数类样本的同时，删除多数类样本中与少数类样本距离较远的一些样本。NCR 欠采样的具体步骤如下：

1. 对于每个少数类样本，找到其 K 个最近邻的多数类样本，并将这 K 个多数类样本称为正常近邻（NN）；

2. 对于每个少数类样本，找到其 K 个最远邻的多数类样本，并将这 K 个多数类样本称为噪声近邻（ON）；

3. 根据正常近邻和噪声近邻之间的距离阈值，删除一些噪声近邻，使得多数类样本数量与少数类样本数量相近。

其中，K 是一个超参数，可以根据具体问题和数据集进行调整，距离阈值可以通过交叉验证等方法进行确定。

下面是一个 Python 示例代码，演示如何使用 NCR 欠采样来处理不平衡数据集：

```python
from imblearn.under_sampling import NeighbourhoodCleaningRule
from sklearn.datasets import make_classification

# 生成不平衡数据集
X, y = make_classification(n_classes=2, class_sep=2, weights=[0.1, 0.9], n_informative=3,
                           n_redundant=1, flip_y=0, n_features=20, n_clusters_per_class=1,
                           n_samples=1000, random_state=10)

# 使用NCR欠采样处理数据集
ncr = NeighbourhoodCleaningRule()
X_resampled, y_resampled = ncr.fit_resample(X, y)
```

在上面的代码中，我们使用 Scikit-learn 库生成一个不平衡的二分类数据集，其中多数类样本的权重为 0.9，少数类样本的权重为 0.1。然后，我们使用 imbalanced-learn 库中的 NeighbourhoodCleaningRule 类来对数据集进行欠采样处理，得到平衡的数据集 X_resampled 和 y_resampled。

NCR 欠采样的优点是可以有效地减少多数类样本中的噪声，同时保留多数类样本中与少数类样本距离较近的样本，从而在保证数据集平衡性的同时，保留了数据集的重要信息。但是，NCR 欠采样也有一些缺点，如对于高维数据集，K 近邻算法容易受到维度灾难的影响，而且 K 的选择需要根据具体问题进行调整，不易确定。

下面是使用 Python 实现 NCR 欠采样的示例代码：

```python
from imblearn.under_sampling import NeighbourhoodCleaningRule

# 定义NCR欠采样模型
ncr = NeighbourhoodCleaningRule(n_neighbors=5, threshold_cleaning=0.5, n_jobs=-1)

# 对数据进行欠采样处理
X_resampled, y_resampled = ncr.fit_resample(X, y)
```

在这个示例代码中，我们首先导入了 NeighbourhoodCleaningRule 类，并定义了一个实例化对象 ncr，其中 n_neighbors 表示用于计算近邻的 K 值，threshold_cleaning 表示清洗阈值，即确定哪些近邻被视为噪声近邻的阈值，n_jobs 表示使用的 CPU 数量。

然后，我们使用 fit_resample 方法对数据进行欠采样处理，返回欠采样后的数据集 X_resampled 和 y_resampled。

需要注意的是，NeighbourhoodCleaningRule 类只适用于二分类问题，如果需要处理多分类问题，需要使用其他的欠采样方法。同时，为了避免数据泄露问题，在对数据进行欠采样处理之前，应该将数据集分为训练集和测试集，并在训练集上进行欠采样处理。

总的来说，NCR 欠采样是一种简单而有效的基于近邻的欠采样方法，适用于各种不平衡数据集的处理。
