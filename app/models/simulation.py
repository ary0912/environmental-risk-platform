import numpy as np

def simulate_propagation(grid, wind_factor=1.0, steps=3):
    """
    Simulates probabilistic environmental risk propagation
    across a 2D grid.
    """

    grid = np.array(grid)
    rows, cols = grid.shape

    for _ in range(steps):
        new_grid = grid.copy()

        for i in range(rows):
            for j in range(cols):

                neighbors = []

                # Collect 4-direction neighbors
                if i > 0:
                    neighbors.append(grid[i-1][j])
                if i < rows-1:
                    neighbors.append(grid[i+1][j])
                if j > 0:
                    neighbors.append(grid[i][j-1])
                if j < cols-1:
                    neighbors.append(grid[i][j+1])

                if neighbors:
                    spread_probability = np.mean(neighbors) * 0.6 * wind_factor

                    if np.random.rand() < spread_probability:
                        new_grid[i][j] = min(1.0, grid[i][j] + 0.3)

        grid = new_grid

    return grid.tolist()