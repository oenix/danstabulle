<?php

namespace DTB\BdBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Planche
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="DTB\BdBundle\Entity\PlancheRepository")
 */
class Planche
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
     * @ORM\ManytoOne(targetEntity="DTB\BdBundle\Entity\BandeDessinee", inversedBy="planches", cascade={"persist"})
     */
    private $bandeDessinee;


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
     * Set bandeDessinee
     *
     * @param \DTB\BdBundle\Entity\BandeDessinee $bandeDessinee
     * @return Planche
     */
    public function setBandeDessinee(\DTB\BdBundle\Entity\BandeDessinee $bandeDessinee = null)
    {
        $this->bandeDessinee = $bandeDessinee;
    
        return $this;
    }

    /**
     * Get bandeDessinee
     *
     * @return \DTB\BdBundle\Entity\BandeDessinee 
     */
    public function getBandeDessinee()
    {
        return $this->bandeDessinee;
    }
}