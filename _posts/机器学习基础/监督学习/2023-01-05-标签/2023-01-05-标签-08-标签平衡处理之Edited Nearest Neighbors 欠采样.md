---
title: 机器学习基础-监督学习-标签平衡处理之 Edited Nearest Neighbors (ENN) 欠采样
categories: [机器学习]
tags: [人工智能, 机器学习, 监督学习]
math: true
---

Edited Nearest Neighbors (ENN) 是一种基于 KNN 的欠采样方法，它通过移除多数类样本中与少数类样本相似度较低的样本，来实现数据平衡。具体来说，该方法先使用 KNN 方法找到所有的少数类样本的 K 个最近邻居，然后对每个少数类样本，再找到其 K 个最近邻居中的多数类样本。如果这 K 个多数类样本中有超过一半的样本被认为是异常点，则将这个少数类样本删除。

该方法的核心思想是：删除多数类样本中与少数类样本差异较大的样本，以提高模型的分类性能。不过需要注意的是，ENN 方法可能会过度削减多数类样本，从而导致模型的泛化能力下降。

下面给出一个使用 Python 实现 Edited Nearest Neighbors 的示例代码：

```python
from sklearn.neighbors import KNeighborsClassifier
from imblearn.under_sampling import EditedNearestNeighbours

# 构造数据集和标签
X = [[0, 0], [0, 1], [1, 0], [2, 1], [2, 2], [3, 2]]
y = [0, 0, 0, 1, 1, 1]

# 使用 KNN 方法找到所有少数类样本的最近邻居
knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X, y)
neigh = knn.kneighbors(X, return_distance=False)

# 使用 Edited Nearest Neighbors 方法对多数类样本进行欠采样
enn = EditedNearestNeighbours(sampling_strategy='auto', n_neighbors=3)
X_resampled, y_resampled = enn.fit_resample(X, y)

# 输出结果
print("Original dataset shape:", X.shape, y.shape)
print("Resampled dataset shape:", X_resampled.shape, y_resampled.shape)
```

在该示例代码中，我们首先使用 KNN 方法找到所有少数类样本的最近邻居，然后使用 Edited Nearest Neighbors 方法对多数类样本进行欠采样。最后，我们输出原始数据集和欠采样后的数据集的形状，以检验欠采样方法的效果。

需要注意的是，该示例代码中使用了 imbalanced-learn 库中的 EditedNearestNeighbours 类来实现 Edited Nearest Neighbors 方法。该库是一个用于解决不平衡数据问题的 Python 库，可以方便地实现各种欠采样和过采样方法。

除了使用 imbalanced-learn 库中的 EditedNearestNeighbours 类之外，我们也可以手动实现 Edited Nearest Neighbors 方法。下面给出一个手动实现 Edited Nearest Neighbors 方法的示例代码：

```python
from sklearn.neighbors import KNeighborsClassifier
import numpy as np

def edited_nearest_neighbors(X, y, k=3):
    """
    手动实现 Edited Nearest Neighbors 方法
    """
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X, y)

    # 找到所有少数类样本的最近邻居
    minority_indices = np.where(y == 1)[0]
    minority_neighbors = knn.kneighbors(X[minority_indices], return_distance=False)

    # 找到所有多数类样本的最近邻居
    majority_indices = np.where(y == 0)[0]
    majority_neighbors = knn.kneighbors(X[majority_indices], return_distance=False)

    # 删除多数类样本中与少数类样本相似度较低的样本
    indices_to_remove = []
    for i, minority_index in enumerate(minority_indices):
        majority_neighbor_indices = majority_neighbors[i]
        majority_neighbor_labels = y[majority_indices[majority_neighbor_indices]]
        if np.sum(majority_neighbor_labels) < k / 2:
            indices_to_remove.append(majority_indices[majority_neighbor_indices])

    X_resampled = np.delete(X, indices_to_remove, axis=0)
    y_resampled = np.delete(y, indices_to_remove, axis=0)

    return X_resampled, y_resampled
```

该示例代码中，我们首先使用 KNN 方法找到所有少数类样本的最近邻居和所有多数类样本的最近邻居，然后对于每个少数类样本，找到其最近邻居中的多数类样本，并检查这些多数类样本中有多少被认为是异常点。如果有超过一半的多数类样本被认为是异常点，则将这个少数类样本从数据集中删除。最后，我们输出删除后的数据集。

需要注意的是，手动实现 Edited Nearest Neighbors 方法需要一定的编程能力，并且在处理大规模数据时可能会比较慢。因此，在实际应用中，建议使用已有的库函数来实现 Edited Nearest Neighbors 方法。
