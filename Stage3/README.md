## SCM Strategy

We use **GitHub** as the version control platform and follow a **Simplified Git Flow** branching strategy:

- **main**: Stable production branch.  
- **dev**: Primary development branch created from `main`.  
- **feature branches**: Each feature or task is developed in its own branch created from `dev`.  

### Workflow

1. Developers create feature branches from `dev`.  
2. Work is committed **regularly**.  
3. A **Pull Request (PR)** is opened to merge the feature branch into `dev`.  
4. **One or two reviewers** must approve the PR.  
5. After approval, the PR creator merges the feature branch into `dev`.  
6. Once development is complete, `dev` is merged into `main` for production release.
