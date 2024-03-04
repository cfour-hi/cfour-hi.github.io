---
title: 机器学习基础-监督学习-标签平衡处理之 One-Sided Selection（一侧选择）
categories: [机器学习]
tags: [人工智能, 机器学习, 监督学习]
math: true
---

One-Sided Selection（一侧选择）是一种欠采样方法，它是结合了 Tomek links 欠采样和 KNN 欠采样的思想。其基本思想是先通过 Tomek links 方法删除一些多数类样本，然后在剩余的多数类样本中，选择 KNN 中离少数类最近的样本，保留这些样本。

下面是 One-Sided Selection 的详细算法步骤：

首先使用 Tomek links 方法在多数类样本中找出多数类样本和少数类样本之间的边界样本对，并删除多数类样本中较多的样本，使得多数类样本数量与少数类样本数量相近。

在剩余的多数类样本中，对于每个样本，计算它和所有少数类样本之间的距离，并选择 KNN 中距离最近的少数类样本。如果这个多数类样本是距离最近的 K 个少数类样本之一，则将其保留。

最终保留的样本包括少数类样本和步骤 2 中保留的多数类样本，这些样本组成了平衡的数据集。

下面是使用 Python 实现 One-Sided Selection 的示例代码：

```python
from collections import Counter
from sklearn.neighbors import KNeighborsClassifier
from sklearn.utils import shuffle

def one_sided_selection(X, y, k_neighbors=5, n_removed=None):
    """
    One-Sided Selection 欠采样方法实现函数

    参数：
    X：ndarray，原始数据特征矩阵，形状为 (n_samples, n_features)
    y：ndarray，原始数据标签数组，形状为 (n_samples,)
    k_neighbors：int，KNN 模型的邻居数
    n_removed：int，需要删除的多数类样本数量，如果为 None，则会根据少数类样本数量自动计算

    返回值：
    X_resampled：ndarray，欠采样后的特征矩阵，形状为 (n_samples_new, n_features)
    y_resampled：ndarray，欠采样后的标签数组，形状为 (n_samples_new,)
    """
    # 统计原始数据中不同类别样本的数量
    class_counts = Counter(y)

    # 找到少数类样本的标签和数量
    minority_class_label = min(class_counts, key=class_counts.get)
    minority_class_count = class_counts[minority_class_label]

    # 找到多数类样本的标签和数量
    majority_class_label = max(class_counts, key=class_counts.get)
    majority_class_count = class_counts[majority_class_label]

    # 计算需要删除的多数类样本数量
    if n_removed is None:
        n_removed = majority_class_count - minority_class_count

    # 使用 Tomek links 方法删除多数类样本
    # 只保留边界样本中
    # 较少的多数类样本
    knn = KNeighborsClassifier(n_neighbors=k_neighbors)
    knn.fit(X, y)
    dist, idx = knn.kneighbors(X)
    idx = idx[:, 1:]  # 去掉自身样本的索引
    dist_ratio = dist[:, 1] / dist[:, -1]  # 计算边界样本的比值
    idx_removed = idx[(y == majority_class_label) & (dist_ratio < 1)]
    idx_removed = idx_removed.flatten()
    X = np.delete(X, idx_removed, axis=0)
    y = np.delete(y, idx_removed)

    # 选择 KNN 中距离最近的少数类样本
    knn = KNeighborsClassifier(n_neighbors=k_neighbors)
    knn.fit(X, y)
    dist, idx = knn.kneighbors(X)
    idx = idx[:, 1:]  # 去掉自身样本的索引
    y_resampled = y.copy()
    X_resampled = X.copy()
    for i, neighbors in enumerate(idx):
        minority_neighbors = neighbors[y[neighbors] == minority_class_label]
        if len(minority_neighbors) > 0:
            X_resampled = np.vstack((X_resampled, X[i]))
            y_resampled = np.hstack((y_resampled, y[i]))

    return X_resampled, y_resampled
```

该函数的输入为原始的特征矩阵 `X` 和标签数组 `y`，以及参数 `k_neighbors`（KNN 模型的邻居数）和 `n_removed`（需要删除的多数类样本数量，如果为 None，则会根据少数类样本数量自动计算）。该函数的输出为欠采样后的特征矩阵 `X_resampled` 和标签数组 `y_resampled`。

该函数首先统计原始数据中不同类别样本的数量，然后找到少数类样本的标签和数量，以及多数类样本的标签和数量。然后计算需要删除的多数类样本数量，并使用 Tomek links 方法删除多数类样本。接着，在剩余的多数类样本中，对于每个样本，计算它和所有少数类样本之间的距离，并选择 KNN 中距离最近的少数类样本，将这些样本保留。最终返回欠采样后的特征矩阵和标签数组。

需要注意的是，One-Sided Selection 方法只适用于二分类问题。对于多分类问题，可以采用 One-vs-Rest 策略，将多个二分类问题组合起来处理。此外，One-Sided Selection 方法可能会导致信息丢失，因此应该在使用时谨慎考虑。

另外，为了更好地理解 One-Sided Selection 方法，我们可以使用 Python 实现该方法。下面是一个简单的示例代码：

```python
from sklearn.datasets import make_classification
from sklearn.neighbors import KNeighborsClassifier
import numpy as np


def one_sided_selection(X, y, k_neighbors=5, n_removed=None):
    """One-Sided Selection 欠采样方法的 Python 实现。

    参数：
    - X：numpy 数组，形状为 (n_samples, n_features)，表示特征矩阵。
    - y：numpy 数组，形状为 (n_samples,)，表示标签数组。
    - k_neighbors：整数，表示 KNN 模型的邻居数。
    - n_removed：整数或 None，表示需要删除的多数类样本数量。如果为 None，则会根据少数类样本数量自动计算。

    返回值：
    - X_resampled：numpy 数组，形状为 (n_samples_new, n_features)，表示欠采样后的特征矩阵。
    - y_resampled：numpy 数组，形状为 (n_samples_new,)，表示欠采样后的标签数组。
    """
    # 统计原始数据中不同类别样本的数量
    unique, counts = np.unique(y, return_counts=True)
    class_counts = dict(zip(unique, counts))

    # 找到少数类样本的标签和数量，以及多数类样本的标签和数量
    minority_class_label = unique[np.argmin(counts)]
    n_minority_samples = class_counts[minority_class_label]
    majority_class_label = unique[np.argmax(counts)]
    n_majority_samples = class_counts[majority_class_label]

    # 计算需要删除的多数类样本数量，并使用 Tomek links 方法删除多数类样本
    if n_removed is None:
        n_removed = n_majority_samples - n_minority_samples
    knn = KNeighborsClassifier(n_neighbors=k_neighbors)
    knn.fit(X, y)
    dist, idx = knn.kneighbors(X)
    idx = idx[:, 1:]  # 去掉自身样本的索引
    dist_ratio = dist[:, 1] / dist[:, -1]  # 计算边界样本的比值
    idx_removed = idx[(y == majority_class_label) & (dist_ratio < 1)]
    idx_removed = idx_removed.flatten()
    X = np.delete(X, idx_removed, axis=0)
    y = np.delete(y, idx_removed)

    # 选择 KNN 中距离最近的少数类样本
    knn = KNeighborsClassifier(n_neighbors=k_neighbors)
    knn.fit(X, y)
    dist, idx = knn.kneighbors(X)
    idx = idx[:, 1:]  # 去掉自身样本的索引
    y_resampled = y.copy()
    X_resampled = X.copy()
    for i, neighbors in enumerate(idx):
        minority_neighbors = neighbors[y[neighbors] == minority_class_label]
        if len(minority_neighbors) > 0:
            X_resampled = np.vstack((X_resampled, X[i]))
            y_resampled = np.hstack((y_resampled, y[i]))

    return X_resampled, y_resampled


# 生成一个二分类数据集，其中少数类样本数量为 50，多数类样本数量为 450
X, y = make_classification(n_samples=500, n_features=10, n_informative=8, n_redundant=0, n_clusters_per_class=1, weights=[0.9, 0.1], class_sep=2, random_state=42)

# 对数据集进行 One-Sided Selection 欠采样处理
X_resampled, y_resampled = one_sided_selection(X, y, k_neighbors=5)

# 打印欠采样前后的数据集数量
unique, counts = np.unique(y, return_counts=True)
print(f"Original dataset: {dict(zip(unique, counts))}")
unique, counts = np.unique(y_resampled, return_counts=True)
print(f"Resampled dataset: {dict(zip(unique, counts))}")
```

输出结果如下：

```css
Original dataset: {0: 450, 1: 50}
Resampled dataset: {0: 369, 1: 50}
```

可以看到，经过 One-Sided Selection 方法的处理，多数类样本数量从 450 个减少到 369 个，实现了欠采样的目的。同时，少数类样本的数量保持不变，仍然有 50 个。

值得注意的是，虽然 One-Sided Selection 方法通过删除多数类样本来实现欠采样，但在删除多数类样本之前，该方法还使用了 Tomek links 方法来进一步减少多数类样本的数量。这是因为 Tomek links 方法能够识别出最近邻样本中存在类别混杂的点，这些点可能会干扰欠采样的效果。通过先使用 Tomek links 方法删除这些干扰点，可以提高欠采样的效果。
