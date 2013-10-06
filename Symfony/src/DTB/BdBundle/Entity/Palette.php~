<?php

namespace DTB\BdBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Palette
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="DTB\BdBundle\Entity\PaletteRepository")
 */
class Palette
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var array
     *
     * @ORM\Column(name="colors", type="array")
     */
    private $colors;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set colors
     *
     * @param array $colors
     * @return Palette
     */
    public function setColors($colors)
    {
        $this->colors = $colors;
    
        return $this;
    }

    /**
     * Get colors
     *
     * @return array 
     */
    public function getColors()
    {
        return $this->colors;
    }
}