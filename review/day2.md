# Day 2 Review
> Jeff: Add the lab

Welcome back! Please go to https://class.hypertheory-labs.com and sign in and connect to your VM.

**Let me know if you have any problems getting into your VM**

## First Things

- need any help getting caught up with my code?
- review the control flow lab
    - typescript fantasy land or why testing is hard (open world/closed world)
- the pre-work
    - [Start Pre-Work](https://class.hypertheory-labs.com/start-angular/)


## Review of Day 2

### Brief Introduction to Routing
- in Jeff's demos (for now)
- Defining and changing "modes"
- Router Outlet
- RouterLink / RouterLinkActive

### Change Detection
- Lean on signals *everywhere*
- Signals are synchronous, for asynchronous operations you may need observables - we'll cover that a bit tomorrow.


### Component State
- Signals
- Defining Signals
    - Implicit and Explicit Typing
- Computed Signals
- Modifying the Signal Value
    - `set(...)`
    - `update(x => ...)`
- Input Signals
    - optional and required
    - providing values for inputs
- Todo: Outputs

### Control Flow in Templates
- `@let` allows you to define a template variable
- todo: show other template variables (#)
- `@for` is a loop. The track is used for change detection.
- `@if` and `@else` 
- `@switch`
    - exhaustiveness? never!


## Today

### Component Communication Part 2
- Outputs

### Nested Routing

### Services
- Defining Services
- Providing Services
- Exposing signals from services
- Exposing methods
- Exposing properties

### More on Signals
- Effects


### Defining Services as Stores
- Events, etc.