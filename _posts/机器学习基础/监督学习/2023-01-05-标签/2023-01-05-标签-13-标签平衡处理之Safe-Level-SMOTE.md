---
title: 机器学习基础-监督学习-标签平衡处理之 Safe-Level-SMOTE
categories: [机器学习]
tags: [人工智能, 机器学习, 监督学习]
math: true
---

Safe-Level-SMOTE 是一种基于 SMOTE 的过采样方法，它不仅考虑了少数类样本之间的距离，还考虑了多数类样本之间的距离，以避免产生噪声样本。该方法可以被视为一种二次采样方法，其主要思想是对样本进行二次过滤，以保证生成的合成样本是有效的。

下面是 Safe-Level-SMOTE 的详细步骤：

1. 对少数类样本计算每个样本与其 K 近邻之间的距离，得到距离矩阵。
2. 对距离矩阵进行标准化，以确保不同的距离指标具有相同的权重。
3. 对多数类样本计算每个样本与其 K 近邻之间的距离，得到距离矩阵。
4. 对距离矩阵进行标准化。
5. 对每个少数类样本进行下面的操作：
   1. 对当前样本计算其 Safe-Level（安全级别），Safe-Level 定义为少数类样本与多数类样本的距离比值，即 Safe-Level = (Distance to minority) / (Distance to majority)。
   2. 根据 Safe-Level，从当前样本的 K 近邻中选择一个 Safe-Level 最小的样本，记为 nn。
   3. 根据 Safe-Level，计算当前样本需要生成的样本数量，即 N = (Safe-Level - 1) × α。
   4. 对当前样本和 nn 进行线性插值，生成 N 个合成样本。
   5. 将生成的合成样本添加到少数类样本集合中。

其中，α 是一个参数，控制合成样本的数量。

下面是 Safe-Level-SMOTE 的伪代码：

```vbnet
Input: Minority class samples X, majority class samples Y, K, α
Output: Synthetic samples S

for each minority class sample x in X do
    Calculate the K nearest neighbors of x in X
    Calculate the K nearest neighbors of x in Y
    Calculate the Safe-Level (SL) for x
    Choose a neighbor y from the K nearest neighbors in Y with the lowest SL
    Calculate the number of synthetic samples N to generate
    for i = 1 to N do
        Generate a synthetic sample s by linear interpolation between x and y
        Add s to the set of synthetic samples S
    end for
end for
```

Safe-Level-SMOTE 是一种有效的过采样方法，可以提高分类器的性能。同时，需要注意合成样本的数量不宜过多，以避免过拟合问题。

下面是 Safe-Level-SMOTE 的 Python 代码实现：

```python
from sklearn.neighbors import NearestNeighbors
import numpy as np

def safe_level_smote(X, y, K=5, alpha=0.5):
    """
    Safe-Level-SMOTE implementation.
    :param X: Minority class samples.
    :param y: Corresponding class labels.
    :param K: Number of nearest neighbors.
    :param alpha: Oversampling rate.
    :return: Synthetic samples.
    """
    # Find the K nearest neighbors of each sample in the minority class
    knn = NearestNeighbors(n_neighbors=K+1).fit(X)
    _, indices = knn.kneighbors(X)

    S = []
    for i in range(len(X)):
        x = X[i]
        # Find the K nearest neighbors of x in the minority class
        knn_x = X[indices[i][1:]]
        # Find the K nearest neighbors of x in the majority class
        knn_y = X[y != y[i]][indices[i][1:]]

        # Compute the Safe-Level for x
        dist_x = np.linalg.norm(knn_x - x, axis=1)
        dist_y = np.linalg.norm(knn_y - x, axis=1)
        sl = dist_x / dist_y

        # Find the neighbor with the lowest Safe-Level
        nn = knn_y[np.argmin(sl)]
        # Calculate the number of synthetic samples to generate
        N = int(alpha * (sl[np.argmin(sl)] - 1))

        # Generate synthetic samples by linear interpolation
        for j in range(N):
            # Compute the linear interpolation coefficient
            beta = np.random.uniform(0, 1, size=len(x))
            s = x + beta * (nn - x)
            S.append(s)

    return np.array(S)
```

其中，X 是少数类样本集合，y 是对应的类标签。K 是邻居数量，alpha 是过采样率。函数首先计算每个少数类样本的 Safe-Level，然后从多数类样本中选择 Safe-Level 最小的样本作为合成样本的参考点，根据 Safe-Level 计算合成样本的数量，并使用线性插值生成合成样本。最终，函数返回生成的合成样本。

在使用 Safe-Level-SMOTE 进行数据过采样时，需要对 Safe-Level 进行计算。Safe-Level 反映了少数类样本与多数类样本之间的距离关系，计算方法如下：

$$
SL(x_i) = \frac{\min_{x_j \in X_{maj}} ||x_i-x_j||}{\max_{x_j \in X_{maj}} ||x_i-x_j||}
$$

其中，$SL(x_i)$ 表示样本 $x_i$ 的 Safe-Level，$X_{maj}$ 表示多数类样本集合，$\left | \cdot \right |$ 表示欧几里得距离。

Safe-Level 的计算是通过计算少数类样本与多数类样本之间的距离来进行的。具体而言，对于每个少数类样本 $x_i$，找到其在多数类样本集合 $X_{maj}$ 中距离最近的样本 $x_j$，然后将 $x_i$ 与 $x_j$ 之间的距离作为 Safe-Level 的分子，将 $x_i$ 与 $X_{maj}$ 中所有样本之间的距离的最大值作为 Safe-Level 的分母。

Safe-Level 的计算结果在 [0, 1] 的范围内，值越小表示少数类样本越接近多数类样本。在 Safe-Level-SMOTE 的实现中，对于每个少数类样本，选择 Safe-Level 最小的多数类样本作为合成样本的参考点。选择 Safe-Level 最小的多数类样本是因为这样可以尽可能地增加样本之间的差异性，从而提高合成样本的多样性。同时，Safe-Level 还被用来计算合成样本的数量，Safe-Level 越小的少数类样本需要生成更多的合成样本。
